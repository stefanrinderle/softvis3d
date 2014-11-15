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

import de.rinderle.softviz3d.domain.LayoutViewType;
import de.rinderle.softviz3d.domain.MinMaxValue;
import de.rinderle.softviz3d.domain.SoftViz3dConstants;
import de.rinderle.softviz3d.domain.graph.ResultPlatform;
import de.rinderle.softviz3d.grappa.GrappaGraphFactory;
import de.rinderle.softviz3d.layout.format.LayerFormatterBean;
import org.junit.Test;

import java.awt.*;

import static junit.framework.TestCase.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

public class LayerFormatterBeanTest {

  private LayerFormatterBean underTest = new LayerFormatterBean();

  // TODO better assertions.

  @Test
  public void testFormat() {
    final Integer depth = 0;
    final ResultPlatform graph = GrappaGraphFactory.createGraph();
    this.underTest.format(graph, depth, LayoutViewType.CITY);

    assertNotNull(graph.getAttributeValue(SoftViz3dConstants.GRAPH_ATTR_COLOR));
  }

  @Test
  public void testMaxDepth() {
    final Integer depth = Integer.MAX_VALUE;
    final ResultPlatform graph = GrappaGraphFactory.createGraph();
    this.underTest.format(graph, depth, LayoutViewType.CITY);

    assertNotNull(graph.getAttributeValue(SoftViz3dConstants.GRAPH_ATTR_COLOR));

    final Color color = (Color) graph.getAttributeValue(SoftViz3dConstants.GRAPH_ATTR_COLOR);
    assertTrue(color.getRed() == 254);
  }

  /**
   * BUILDING HEIGHT
   */

  @Test
  public void calcBuildingHeightTest() {
    final Double value = 1.1;
    final MinMaxValue minMaxMetricHeight = new MinMaxValue(0.0, 10.0);

    final double result = this.underTest.calcBuildingHeight(value, minMaxMetricHeight);

    // 1.1 is 11 percent of 10
    assertEquals(Double.valueOf(11), Double.valueOf(result));
  }

  @Test
  public void calcBuildingHeightTest2() {
    final Double value = 2.0;
    final MinMaxValue minMaxMetricHeight = new MinMaxValue(0.0, 200.0);

    final double result = this.underTest.calcBuildingHeight(value, minMaxMetricHeight);

    // 2 is 1 percent of 200.
    assertEquals(Double.valueOf(1), Double.valueOf(result));
  }

  @Test
  public void calcBuildingHeightMinUpperTest() {
    final Double value = 11.1;
    final MinMaxValue minMaxMetricHeight = new MinMaxValue(10.0, 20.0);

    final double result = this.underTest.calcBuildingHeight(value, minMaxMetricHeight);

    // 1.1 (11.1 - 10) is 11 percent of 10 (20 - 10)
    assertTrue(result > 10.9999999);
    assertTrue(result < 11.0000001);
  }

  @Test
  public void calcBuildingHeightRangeLessThanZero() {
    final Double value = 11.1;
    final MinMaxValue minMaxMetricHeight = new MinMaxValue(20.0, 10.0);

    final double result = this.underTest.calcBuildingHeight(value, minMaxMetricHeight);

    assertEquals(Double.valueOf(0), Double.valueOf(result));
  }

  @Test
  public void calcBuildingHeightValueBelowRangeTest() {
    final Double value = 1.1;
    final MinMaxValue minMaxMetricHeight = new MinMaxValue(10.0, 20.0);

    final double result = this.underTest.calcBuildingHeight(value, minMaxMetricHeight);

    assertEquals(Double.valueOf(0), Double.valueOf(result));
  }

  @Test
  public void calcBuildingHeightNullTest() {
    final Double value = null;
    final MinMaxValue minMaxMetricHeight = new MinMaxValue(0.0, 10.0);

    final double result = this.underTest.calcBuildingHeight(value, minMaxMetricHeight);

    assertEquals(Double.valueOf(0), Double.valueOf(result));
  }

  /**
   * SIDE LENGTH
   */

  @Test
  public void calcSideLengthTest() {
    final Double value = 1.1;
    final MinMaxValue minMaxMetricHeight = new MinMaxValue(0.0, 10.0);

    final double result = this.underTest.calcSideLength(value, minMaxMetricHeight);

    // 1.1 is 11 percent of 10
    assertEquals(Double.valueOf(11), Double.valueOf(result));
  }

  @Test
  public void calcSideLengthTest2() {
    final Double value = 20.0;
    final MinMaxValue minMaxMetricHeight = new MinMaxValue(0.0, 200.0);

    final double result = this.underTest.calcSideLength(value, minMaxMetricHeight);

    // 20 is 10 percent of 200.
    assertEquals(Double.valueOf(10), Double.valueOf(result));
  }

  @Test
  public void calcSideLengthMinLengthTest() {
    final Double value = 0.5;
    final MinMaxValue minMaxMetricHeight = new MinMaxValue(0.0, 200.0);

    final double result = this.underTest.calcSideLength(value, minMaxMetricHeight);

    // 0.5 is 0.25 percent of 200 which is below 0.5
    assertEquals(Double.valueOf(SoftViz3dConstants.MIN_SIDE_LENGTH_PERCENT), Double.valueOf(result));
  }

  @Test
  public void calcSideLengthMinUpperTest() {
    final Double value = 11.1;
    final MinMaxValue minMaxMetricHeight = new MinMaxValue(10.0, 20.0);

    final double result = this.underTest.calcSideLength(value, minMaxMetricHeight);

    // 1.1 (11.1 - 10) is 11 percent of 10 (20 - 10)
    assertTrue(result > 10.9999999);
    assertTrue(result < 11.0000001);
  }

  @Test
  public void calcSideLengthRangeLessThanZero() {
    final Double value = 11.1;
    final MinMaxValue minMaxMetricHeight = new MinMaxValue(20.0, 10.0);

    final double result = this.underTest.calcSideLength(value, minMaxMetricHeight);

    assertEquals(Double.valueOf(SoftViz3dConstants.MIN_SIDE_LENGTH_PERCENT), Double.valueOf(result));
  }

  @Test
  public void calcSideLengthValueBelowRangeTest() {
    final Double value = 1.1;
    final MinMaxValue minMaxMetricHeight = new MinMaxValue(10.0, 20.0);

    final double result = this.underTest.calcSideLength(value, minMaxMetricHeight);

    assertEquals(Double.valueOf(SoftViz3dConstants.MIN_SIDE_LENGTH_PERCENT), Double.valueOf(result));
  }

  @Test
  public void calcSideLengthNullTest() {
    final Double value = null;
    final MinMaxValue minMaxMetricHeight = new MinMaxValue(0.0, 10.0);

    final double result = this.underTest.calcSideLength(value, minMaxMetricHeight);

    assertEquals(Double.valueOf(SoftViz3dConstants.MIN_SIDE_LENGTH_PERCENT), Double.valueOf(result));
  }

}
