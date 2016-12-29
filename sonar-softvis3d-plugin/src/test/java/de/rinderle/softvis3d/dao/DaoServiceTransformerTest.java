/**
 * SoftVis3D Sonar plugin
 * Copyright (C) 2016 Stefan Rinderle and Yvo Niedrich
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
package de.rinderle.softvis3d.dao;

import de.rinderle.softvis3d.domain.sonar.SonarMeasure;

import java.util.ArrayList;
import java.util.List;

import org.junit.Test;
import org.sonarqube.ws.WsComponents;
import org.sonarqube.ws.WsMeasures;

import static org.junit.Assert.assertEquals;

public class DaoServiceTransformerTest {

  private final DaoServiceTransformer daoServiceTransformer = new DaoServiceTransformer();

  @Test
  public void testTransformComponentToModules() throws Exception {
    final List<WsComponents.Component> inputList = new ArrayList<>();

    final String expectedId = "123";
    final String expectedName = "456";
    final String expectedPath = "789";
    final WsComponents.Component.Builder wsComponent = WsComponents.Component.newBuilder()
        .setId(expectedId)
        .setName(expectedName)
        .setPath(expectedPath);

    inputList.add(wsComponent.build());

    final List<SonarMeasure> result = daoServiceTransformer.transformComponentToModules(inputList);

    assertEquals(1, result.size());
    assertEquals(expectedId, result.get(0).getId());
    assertEquals(expectedName, result.get(0).getName());
    assertEquals(expectedPath, result.get(0).getPath());
  }

  @Test
  public void testTransformComponentToMeasure() throws Exception {
    final List<WsMeasures.Component> inputList = new ArrayList<>();

    final String expectedId = "123";
    final String expectedName = "456";
    final String expectedPath = "789";

    final WsMeasures.Measure.Builder measure1 = WsMeasures.Measure.newBuilder()
        .setMetric("20")
        .setValue("1.1");
    final WsMeasures.Measure.Builder measure2 = WsMeasures.Measure.newBuilder()
        .setMetric("1")
        .setValue("2.2");

    final WsMeasures.Component.Builder wsComponent = WsMeasures.Component.newBuilder()
        .setId(expectedId)
        .setName(expectedName)
        .setPath(expectedPath)
        .addMeasures(0, measure1)
        .addMeasures(1, measure2);

    inputList.add(wsComponent.build());

    final List<SonarMeasure> result = daoServiceTransformer.transformComponentToMeasure(inputList);

    assertEquals(1, result.size());
    assertEquals(expectedId, result.get(0).getId());
    assertEquals(expectedName, result.get(0).getName());
    assertEquals(expectedPath, result.get(0).getPath());
  }
}