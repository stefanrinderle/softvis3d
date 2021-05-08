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
package de.rinderle.softvis3d;

import org.testcontainers.containers.BindMode;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.Network;
import org.testcontainers.containers.output.OutputFrame;
import org.testcontainers.images.builder.ImageFromDockerfile;

import java.io.File;
import java.util.function.Consumer;

public class ProtractorTestsContainer extends GenericContainer<ProtractorTestsContainer> {

    public ProtractorTestsContainer(String version, Network network, String host, Integer port, Consumer<OutputFrame> logConsumer) {
        super(getImageFromDockerfile());

        this.withNetwork(network);

        String baseUrlCommand = "--baseUrl=http://" + host + ":" + port + "/";
        File file = new File("./resultTmp/" + version);
        file.mkdirs();

        this.withCommand(baseUrlCommand);
        this.withFileSystemBind(file.getPath(), "/protractor/results/", BindMode.READ_WRITE);
        this.withLogConsumer(logConsumer);
    }

    private static ImageFromDockerfile getImageFromDockerfile() {
        File dockerfile = new File("target/test-classes/protractor/Dockerfile");

        return new ImageFromDockerfile("protractor-tests", false)
                .withDockerfile(dockerfile.toPath());
    }

}
