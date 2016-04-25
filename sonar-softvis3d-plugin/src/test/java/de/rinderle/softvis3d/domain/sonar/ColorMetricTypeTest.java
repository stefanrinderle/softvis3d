/**
 * SoftVis3D Sonar plugin
 * Copyright (C) 2016 Stefan Rinderle
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

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

public class ColorMetricTypeTest {

  @Test
  public void testColorMetricTypeNone() {
    final ColorMetricType result = ColorMetricType.getColorMetricType(ColorMetricType.NONE.name());

    assertEquals(ColorMetricType.NONE.name(), result.getDefaultMetricName());
    assertNull(result.getScmCalculationService());
  }

  @Test
  public void testColorMetricTypeAuthorCount() {
    final ColorMetricType result = ColorMetricType.getColorMetricType(ColorMetricType.AUTHOR_COUNT.name());

    assertEquals(ColorMetricType.AUTHOR_COUNT.name(), result.getDefaultMetricName());
  }

  @Test
  public void testColorMetricTypeCommitCount() {
    final ColorMetricType result = ColorMetricType.getColorMetricType(ColorMetricType.COMMIT_COUNT.name());

    assertEquals(ColorMetricType.COMMIT_COUNT.name(), result.getDefaultMetricName());
  }

  @Test
  public void testColorMetricTypeDefault() {
    final String metricName = "ncloc";
    final ColorMetricType result = ColorMetricType.getColorMetricType(metricName);

    assertNull(result.getScmCalculationService());
    final String check = result.getDefaultMetricName();
    assertEquals(metricName, check);
  }

}