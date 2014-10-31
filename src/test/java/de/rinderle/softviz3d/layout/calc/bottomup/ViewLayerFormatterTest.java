/*
 * SoftViz3d Sonar plugin
 * Copyright (C) 2013 Stefan Rinderle
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
package de.rinderle.softviz3d.layout.calc.bottomup;

import att.grappa.Graph;
import de.rinderle.softviz3d.grappa.GrappaGraphFactory;
import de.rinderle.softviz3d.layout.calc.LayoutViewType;
import de.rinderle.softviz3d.layout.interfaces.SoftViz3dConstants;
import de.rinderle.softviz3d.sonar.SonarMetric;
import org.junit.Test;

import java.awt.*;

import static junit.framework.TestCase.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

public class ViewLayerFormatterTest {

  private ViewLayerFormatter underTest = new ViewLayerFormatter();

  // TODO better assertions.

  @Test
  public void testFormat() {
    final Integer depth = 0;
    final Graph graph = GrappaGraphFactory.createGraph();
    underTest.format(graph, depth, LayoutViewType.CITY);

    assertNotNull(graph.getAttribute(SoftViz3dConstants.GRAPH_ATTR_COLOR));
  }

  @Test
  public void testMaxDepth() {
    final Integer depth = Integer.MAX_VALUE;
    final Graph graph = GrappaGraphFactory.createGraph();
    underTest.format(graph, depth, LayoutViewType.CITY);

    assertNotNull(graph.getAttribute(SoftViz3dConstants.GRAPH_ATTR_COLOR));

    final Color color = (Color) graph.getAttribute(SoftViz3dConstants.GRAPH_ATTR_COLOR).getValue();
    assertTrue(color.getRed() == 254);
  }

  /**
   * BUILDING HEIGHT
   */

  @Test
  public void calcBuildingHeightTest() {
    final Double value = 1.1;
    final SonarMetric metricHeight = new SonarMetric(0.0, 10.0);

    final double result = underTest.calcBuildingHeight(value, metricHeight);

    // 1.1 is 11 percent of 10
    assertEquals(Double.valueOf(11), Double.valueOf(result));
  }

  @Test
  public void calcBuildingHeightTest2() {
    final Double value = 2.0;
    final SonarMetric metricHeight = new SonarMetric(0.0, 200.0);

    final double result = underTest.calcBuildingHeight(value, metricHeight);

    // 2 is 1 percent of 200.
    assertEquals(Double.valueOf(1), Double.valueOf(result));
  }

  @Test
  public void calcBuildingHeightMinUpperTest() {
    final Double value = 11.1;
    final SonarMetric metricHeight = new SonarMetric(10.0, 20.0);

    final double result = underTest.calcBuildingHeight(value, metricHeight);

    // 1.1 (11.1 - 10) is 11 percent of 10 (20 - 10)
    assertTrue(result > 10.9999999);
    assertTrue(result < 11.0000001);
  }

  @Test
  public void calcBuildingHeightRangeLessThanZero() {
    final Double value = 11.1;
    final SonarMetric metricHeight = new SonarMetric(20.0, 10.0);

    final double result = underTest.calcBuildingHeight(value, metricHeight);

    assertEquals(Double.valueOf(0), Double.valueOf(result));
  }

  @Test
  public void calcBuildingHeightValueBelowRangeTest() {
    final Double value = 1.1;
    final SonarMetric metricHeight = new SonarMetric(10.0, 20.0);

    final double result = underTest.calcBuildingHeight(value, metricHeight);

    assertEquals(Double.valueOf(0), Double.valueOf(result));
  }

  @Test
  public void calcBuildingHeightNullTest() {
    final Double value = null;
    final SonarMetric metricHeight = new SonarMetric(0.0, 10.0);

    final double result = underTest.calcBuildingHeight(value, metricHeight);

    assertEquals(Double.valueOf(0), Double.valueOf(result));
  }

  /**
   * SIDE LENGTH
   */

  @Test
  public void calcSideLengthTest() {
    final Double value = 1.1;
    final SonarMetric metricHeight = new SonarMetric(0.0, 10.0);

    final double result = underTest.calcSideLength(value, metricHeight);

    // 1.1 is 11 percent of 10
    assertEquals(Double.valueOf(11), Double.valueOf(result));
  }

  @Test
  public void calcSideLengthTest2() {
    final Double value = 20.0;
    final SonarMetric metricHeight = new SonarMetric(0.0, 200.0);

    final double result = underTest.calcSideLength(value, metricHeight);

    // 20 is 10 percent of 200.
    assertEquals(Double.valueOf(10), Double.valueOf(result));
  }

  @Test
  public void calcSideLengthMinLengthTest() {
    final Double value = 0.5;
    final SonarMetric metricHeight = new SonarMetric(0.0, 200.0);

    final double result = underTest.calcSideLength(value, metricHeight);

    // 0.5 is 0.25 percent of 200 which is below 0.5
    assertEquals(Double.valueOf(SoftViz3dConstants.MIN_SIDE_LENGTH_PERCENT), Double.valueOf(result));
  }

  @Test
  public void calcSideLengthMinUpperTest() {
    final Double value = 11.1;
    final SonarMetric metricHeight = new SonarMetric(10.0, 20.0);

    final double result = underTest.calcSideLength(value, metricHeight);

    // 1.1 (11.1 - 10) is 11 percent of 10 (20 - 10)
    assertTrue(result > 10.9999999);
    assertTrue(result < 11.0000001);
  }

  @Test
  public void calcSideLengthRangeLessThanZero() {
    final Double value = 11.1;
    final SonarMetric metricHeight = new SonarMetric(20.0, 10.0);

    final double result = underTest.calcSideLength(value, metricHeight);

    assertEquals(Double.valueOf(SoftViz3dConstants.MIN_SIDE_LENGTH_PERCENT), Double.valueOf(result));
  }

  @Test
  public void calcSideLengthValueBelowRangeTest() {
    final Double value = 1.1;
    final SonarMetric metricHeight = new SonarMetric(10.0, 20.0);

    final double result = underTest.calcSideLength(value, metricHeight);

    assertEquals(Double.valueOf(SoftViz3dConstants.MIN_SIDE_LENGTH_PERCENT), Double.valueOf(result));
  }

  @Test
  public void calcSideLengthNullTest() {
    final Double value = null;
    final SonarMetric metricHeight = new SonarMetric(0.0, 10.0);

    final double result = underTest.calcSideLength(value, metricHeight);

    assertEquals(Double.valueOf(SoftViz3dConstants.MIN_SIDE_LENGTH_PERCENT), Double.valueOf(result));
  }
}
