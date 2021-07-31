package de.rinderle.softvis3d;
/**
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

import org.junit.Ignore;
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

import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;

@Ignore
public class SonarQubeVersionIT {

    private static final Logger LOGGER = LoggerFactory.getLogger(SonarQubeVersionIT.class);
    private final Slf4jLogConsumer logConsumer = new Slf4jLogConsumer(LOGGER);

    private final Network network = Network.newNetwork();

    @Test
    public void testStartCompatibility() {
        this.testPluginWithSQVersion("7.6-community");
    }

    @Test
    public void testLatest() {
        this.testPluginWithSQVersion("latest");
    }

    @Test
    public void testLTS() {
        this.testPluginWithSQVersion("lts-community");
    }

    private void testPluginWithSQVersion(String version) {
        SonarQubeContainer sonarQubeContainer = new SonarQubeContainer(version, network, logConsumer);
        try {
            sonarQubeContainer.start();

            String address = sonarQubeContainer.getNetworkAliases().get(0);
            Integer port = 9000;

            runProjectAnalysis(address, port);

            runE2eTests(version, address, port);
        } finally {
            sonarQubeContainer.stop();
        }
    }

    private void runProjectAnalysis(String address, Integer port) {
        SonarAnalysisContainer analysis = new SonarAnalysisContainer(network, address, port, logConsumer);
        analysis.start();
        analysis.stop();
        analysis.withNetwork(network);
        analysis.start();

        waitForContainerStop(analysis);
    }

    private void runE2eTests(String version, String address, Integer port) {
        ProtractorTestsContainer testsContainer = new ProtractorTestsContainer(version, network, address, port, logConsumer);
        testsContainer.start();
        testsContainer.stop();
        testsContainer.withNetwork(network);
        testsContainer.start();

        waitForContainerStop(testsContainer);

        validateResult(version);
    }

    private void waitForContainerStop(GenericContainer container) {
        while (container.isRunning()) {
            System.out.println("Wait for container processing " + container.getContainerName());
            try {
                Thread.sleep(5000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

    private void validateResult(String version) {
        Path resourceDirectory = Paths.get("resultTmp",version,  "junitresults.xml");

        try {
            String result = FileUtils.readFileToString(resourceDirectory.toFile(), "UTF-8");

            assertTrue(result.contains("testsuite"));
            assertTrue(result.contains("failures=\"0\""));
        } catch (IOException e) {
            fail(e.getMessage());
        }

    }
}