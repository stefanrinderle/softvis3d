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
    Integer depth = 0;
    Graph graph = GrappaGraphFactory.createGraph();
    underTest.format(graph, depth, LayoutViewType.CITY);

    assertNotNull(graph.getAttribute(SoftViz3dConstants.GRAPH_ATTR_COLOR));
  }

  @Test
  public void testMaxDepth() {
    Integer depth = Integer.MAX_VALUE;
    Graph graph = GrappaGraphFactory.createGraph();
    underTest.format(graph, depth, LayoutViewType.CITY);

    assertNotNull(graph.getAttribute(SoftViz3dConstants.GRAPH_ATTR_COLOR));

    Color color = (Color) graph.getAttribute(SoftViz3dConstants.GRAPH_ATTR_COLOR).getValue();
    assertTrue(color.getRed() == 254);
  }

  /**
   * BUILDING HEIGHT
   */

  @Test
  public void calcBuildingHeightTest() {
    Double value = 1.1;
    SonarMetric metricHeight = new SonarMetric(0.0, 10.0);

    double result = underTest.calcBuildingHeight(value, metricHeight);

    // 1.1 is 11 percent of 10
    assertEquals(Double.valueOf(11), Double.valueOf(result));
  }

  @Test
  public void calcBuildingHeightTest2() {
    Double value = 2.0;
    SonarMetric metricHeight = new SonarMetric(0.0, 200.0);

    double result = underTest.calcBuildingHeight(value, metricHeight);

    // 2 is 1 percent of 200.
    assertEquals(Double.valueOf(1), Double.valueOf(result));
  }

  @Test
  public void calcBuildingHeightMinUpperTest() {
    Double value = 11.1;
    SonarMetric metricHeight = new SonarMetric(10.0, 20.0);

    double result = underTest.calcBuildingHeight(value, metricHeight);

    // 1.1 (11.1 - 10) is 11 percent of 10 (20 - 10)
    assertTrue(result > 10.9999999);
    assertTrue(result < 11.0000001);
  }

  @Test
  public void calcBuildingHeightRangeLessThanZero() {
    Double value = 11.1;
    SonarMetric metricHeight = new SonarMetric(20.0, 10.0);

    double result = underTest.calcBuildingHeight(value, metricHeight);

    assertEquals(Double.valueOf(0), Double.valueOf(result));
  }

  @Test
  public void calcBuildingHeightValueBelowRangeTest() {
    Double value = 1.1;
    SonarMetric metricHeight = new SonarMetric(10.0, 20.0);

    double result = underTest.calcBuildingHeight(value, metricHeight);

    assertEquals(Double.valueOf(0), Double.valueOf(result));
  }

  @Test
  public void calcBuildingHeightNullTest() {
    Double value = null;
    SonarMetric metricHeight = new SonarMetric(0.0, 10.0);

    double result = underTest.calcBuildingHeight(value, metricHeight);

    assertEquals(Double.valueOf(0), Double.valueOf(result));
  }

  /**
   * SIDE LENGTH
   */

  @Test
  public void calcSideLengthTest() {
    Double value = 1.1;
    SonarMetric metricHeight = new SonarMetric(0.0, 10.0);

    double result = underTest.calcSideLength(value, metricHeight);

    // 1.1 is 11 percent of 10
    assertEquals(Double.valueOf(11), Double.valueOf(result));
  }

  @Test
  public void calcSideLengthTest2() {
    Double value = 20.0;
    SonarMetric metricHeight = new SonarMetric(0.0, 200.0);

    double result = underTest.calcSideLength(value, metricHeight);

    // 20 is 10 percent of 200.
    assertEquals(Double.valueOf(10), Double.valueOf(result));
  }

  @Test
  public void calcSideLengthMinLengthTest() {
    Double value = 0.5;
    SonarMetric metricHeight = new SonarMetric(0.0, 200.0);

    double result = underTest.calcSideLength(value, metricHeight);

    // 0.5 is 0.25 percent of 200 which is below 0.5
    assertEquals(Double.valueOf(SoftViz3dConstants.MIN_SIDE_LENGTH_PERCENT), Double.valueOf(result));
  }

  @Test
  public void calcSideLengthMinUpperTest() {
    Double value = 11.1;
    SonarMetric metricHeight = new SonarMetric(10.0, 20.0);

    double result = underTest.calcSideLength(value, metricHeight);

    // 1.1 (11.1 - 10) is 11 percent of 10 (20 - 10)
    assertTrue(result > 10.9999999);
    assertTrue(result < 11.0000001);
  }

  @Test
  public void calcSideLengthRangeLessThanZero() {
    Double value = 11.1;
    SonarMetric metricHeight = new SonarMetric(20.0, 10.0);

    double result = underTest.calcSideLength(value, metricHeight);

    assertEquals(Double.valueOf(SoftViz3dConstants.MIN_SIDE_LENGTH_PERCENT), Double.valueOf(result));
  }

  @Test
  public void calcSideLengthValueBelowRangeTest() {
    Double value = 1.1;
    SonarMetric metricHeight = new SonarMetric(10.0, 20.0);

    double result = underTest.calcSideLength(value, metricHeight);

    assertEquals(Double.valueOf(SoftViz3dConstants.MIN_SIDE_LENGTH_PERCENT), Double.valueOf(result));
  }

  @Test
  public void calcSideLengthNullTest() {
    Double value = null;
    SonarMetric metricHeight = new SonarMetric(0.0, 10.0);

    double result = underTest.calcSideLength(value, metricHeight);

    assertEquals(Double.valueOf(SoftViz3dConstants.MIN_SIDE_LENGTH_PERCENT), Double.valueOf(result));
  }
}
