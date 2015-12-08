/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
 * stefan@rinderle.info
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
package de.rinderle.softvis3d.domain.sonar;

import org.junit.Assert;
import org.junit.Test;

/**
 * Created by stefan on 12.07.15.
 */
public class SonarSnapshotBuilderTest {

  @Test
  public void test() {
    final int id = 1;
    final double footprint = 12.34;
    final double height = 23.45;
    final String path = "/path/to/file";
    final int scmMetricValue = 234;
    final SonarSnapshotBuilder builder = new SonarSnapshotBuilder(id)
      .withFootprintMeasure(footprint)
      .withHeightMeasure(height)
      .withPath(path)
      .withScmMetric(scmMetricValue);

    final SonarSnapshot result = builder.build();

    Assert.assertEquals(id, result.getId());
    Assert.assertEquals(height, result.getHeightMetricValue(), 0.0);
    Assert.assertEquals(footprint, result.getFootprintMetricValue(), 0.0);
    Assert.assertEquals(path, result.getPath());
    Assert.assertEquals(scmMetricValue, result.getScmMetricValue());
  }

}
