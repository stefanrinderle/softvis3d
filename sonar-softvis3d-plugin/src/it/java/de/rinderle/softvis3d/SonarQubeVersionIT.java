package de.rinderle.softvis3d; /**
 * SoftVis3D Sonar plugin
 * Copyright (C) 2020 Stefan Rinderle and Yvo Niedrich
 * stefan@rinderle.info / yvo.niedrich@gmail.com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02
 */

import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sonar.api.internal.apachecommons.io.FileUtils;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.Network;
import org.testcontainers.containers.output.Slf4jLogConsumer;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.concurrent.Callable;

import static java.util.concurrent.TimeUnit.SECONDS;
import static org.awaitility.Awaitility.await;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

public class SonarQubeVersionIT {

    private static final Logger LOGGER = LoggerFactory.getLogger(SonarQubeVersionIT.class);
    private final Slf4jLogConsumer logConsumer = new Slf4jLogConsumer(LOGGER);

    private final Network network = Network.newNetwork();

    @Test
    public void test796() {
        this.testSimplePutAndGet("7.9.6");
    }

    @Test
    public void test88() {
        this.testSimplePutAndGet("8.8");
    }

    private void testSimplePutAndGet(String version) {
        SonarQubeContainer sonarQubeContainer = new SonarQubeContainer(version, network, logConsumer);
        try {
            sonarQubeContainer.start();

            String address = (String) sonarQubeContainer.getNetworkAliases().get(0);
            Integer port = 9000;

            runProjectAnalysis(address, port);

            runE2eTests(address, port);
        } finally {
            sonarQubeContainer.stop();
        }
    }

    private void runProjectAnalysis(String address, Integer port) {
        SonarAnalysisContainer analysis = new SonarAnalysisContainer(network, address, port, logConsumer);
        analysis.start();

        await().atMost(300, SECONDS).until(isContainerRunning(analysis));
    }

    private Callable<Boolean> isContainerRunning(GenericContainer analysis) {
        return analysis::isRunning;
    }

    private void runE2eTests(String address, Integer port) {
        ProtractorTestsContainer testsContainer = new ProtractorTestsContainer(network, address, port, logConsumer);
        testsContainer.start();

        await().atMost(300, SECONDS).until(isContainerRunning(testsContainer));

        validateResult();
    }

    private void validateResult() {
        Path resourceDirectory = Paths.get("resultTmp", "junitresults.xml");

        try {
            String result = FileUtils.readFileToString(resourceDirectory.toFile(), "UTF-8");

            assertTrue(result.contains("testsuite"));
            assertTrue(result.contains("failures=\"0\""));
        } catch (IOException e) {
            fail(e.getMessage());
        }

    }
}