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

import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.Network;
import org.testcontainers.containers.output.OutputFrame;
import org.testcontainers.images.builder.ImageFromDockerfile;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Consumer;

public class SonarAnalysisContainer extends GenericContainer<SonarAnalysisContainer> {

    public SonarAnalysisContainer(Network network, String host, Integer port, Consumer<OutputFrame> logConsumer) {
        super(getImageFromDockerfile());

        this.withNetwork(network);

        List<String> args = new ArrayList<>();
        args.add("SQ_HOST=" + host);
        args.add("SQ_PORT=" + port);
        this.setEnv(args);

        this.withLogConsumer(logConsumer);
    }

    private static ImageFromDockerfile getImageFromDockerfile() {
        File dockerfile = new File("target/test-classes/analyse/Dockerfile");

        return new ImageFromDockerfile("maven-analysis", false)
                .withFileFromFile("Dockerfile", dockerfile);
    }

}
