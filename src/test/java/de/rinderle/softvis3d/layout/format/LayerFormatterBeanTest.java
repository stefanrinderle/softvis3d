/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.layout.format;

import de.rinderle.softvis3d.domain.LayoutViewType;
import de.rinderle.softvis3d.domain.MinMaxValue;
import de.rinderle.softvis3d.domain.SoftVis3DConstants;
import de.rinderle.softvis3d.domain.graph.ResultPlatform;
import de.rinderle.softvis3d.grappa.GrappaGraphTestFactory;
import org.junit.Test;

import java.awt.*;

import static junit.framework.TestCase.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

public class LayerFormatterBeanTest {

    private LayerFormatterBean underTest = new LayerFormatterBean();

    @Test
    public void testFormat() {
        final Integer depth = 0;
        final ResultPlatform platform = GrappaGraphTestFactory.createGraph();
        this.underTest.format(platform, depth, LayoutViewType.CITY);

        assertNotNull(platform.getColor());
    }

    @Test
    public void testMaxDepth() {
        final Integer depth = Integer.MAX_VALUE;
        final ResultPlatform platform = GrappaGraphTestFactory.createGraph();
        this.underTest.format(platform, depth, LayoutViewType.CITY);

        assertNotNull(platform.getColor());

        final Color color = platform.getColor();
        System.out.println(color.getRed());
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
        assertEquals(Double.valueOf(SoftVis3DConstants.MIN_BUILDING_HEIGHT), Double.valueOf(result));
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

        assertEquals(Double.valueOf(SoftVis3DConstants.MIN_BUILDING_HEIGHT), Double.valueOf(result));
    }

    @Test
    public void calcBuildingHeightValueBelowRangeTest() {
        final Double value = 1.1;
        final MinMaxValue minMaxMetricHeight = new MinMaxValue(10.0, 20.0);

        final double result = this.underTest.calcBuildingHeight(value, minMaxMetricHeight);

        assertEquals(Double.valueOf(SoftVis3DConstants.MIN_BUILDING_HEIGHT), Double.valueOf(result));
    }

    @Test
    public void calcBuildingHeightNullTest() {
        final Double value = null;
        final MinMaxValue minMaxMetricHeight = new MinMaxValue(0.0, 20.0);

        final double result = this.underTest.calcBuildingHeight(value, minMaxMetricHeight);

        assertEquals(Double.valueOf(SoftVis3DConstants.MIN_BUILDING_HEIGHT), Double.valueOf(result));
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
        assertEquals(Double.valueOf(SoftVis3DConstants.MIN_SIDE_LENGTH), Double.valueOf(result));
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

        assertEquals(Double.valueOf(SoftVis3DConstants.MIN_SIDE_LENGTH), Double.valueOf(result));
    }

    @Test
    public void calcSideLengthValueBelowRangeTest() {
        final Double value = 1.1;
        final MinMaxValue minMaxMetricHeight = new MinMaxValue(10.0, 20.0);

        final double result = this.underTest.calcSideLength(value, minMaxMetricHeight);

        assertEquals(Double.valueOf(SoftVis3DConstants.MIN_SIDE_LENGTH), Double.valueOf(result));
    }

    @Test
    public void calcSideLengthNullTest() {
        final Double value = null;
        final MinMaxValue minMaxMetricHeight = new MinMaxValue(0.0, 10.0);

        final double result = this.underTest.calcSideLength(value, minMaxMetricHeight);

        assertEquals(Double.valueOf(SoftVis3DConstants.MIN_SIDE_LENGTH), Double.valueOf(result));
    }

}
