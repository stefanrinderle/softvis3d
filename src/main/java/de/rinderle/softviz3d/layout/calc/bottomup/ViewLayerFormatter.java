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
import att.grappa.Node;
import de.rinderle.softviz3d.layout.calc.LayoutViewType;
import de.rinderle.softviz3d.layout.helper.HexaColor;
import de.rinderle.softviz3d.layout.interfaces.SoftViz3dConstants;
import de.rinderle.softviz3d.sonar.SonarMetric;
import de.rinderle.softviz3d.tree.TreeNodeType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static att.grappa.GrappaConstants.WIDTH_ATTR;

public class ViewLayerFormatter implements LayerFormatter {

    private static final Logger LOGGER = LoggerFactory
            .getLogger(ViewLayerFormatter.class);

    private static final int MIN_BUILDING_HEIGHT = 10;

    @Override
    public void format(Graph graph, Integer depth, LayoutViewType viewType) {
        // calc color
        int colorCalc = depth * 16;
        if (colorCalc > 154 || colorCalc < 0) {
            colorCalc = 154;
        }

        HexaColor color = new HexaColor(100 + colorCalc, 100 + colorCalc, 100 + colorCalc);
        HexaColor nodesColor = new HexaColor(254, 140, 0);

        graph.setAttribute(SoftViz3dConstants.GRAPH_ATTR_COLOR, color);

        double transparency = 0.0;
        Integer height3d =  depth * 20;;
        if (LayoutViewType.DEPENDENCY.equals(viewType)) {
            height3d = - (depth * 200);
            transparency = 0.7;
        }

        graph.setAttribute(SoftViz3dConstants.GRAPH_ATTR_TRANSPARENCY, transparency + "");

        graph.setAttribute(SoftViz3dConstants.LAYER_HEIGHT_3D, height3d.toString());

        for (Node leaf : graph.nodeElementsAsArray()) {
            fixBuildingHeight(leaf);

            Double width = (Double) leaf.getAttributeValue(WIDTH_ATTR);
            // keep some distance to each other
            width = width * SoftViz3dConstants.DPI_DOT_SCALE;
            leaf.setAttribute(WIDTH_ATTR, width);

            if (leaf.getAttribute("type").getValue().toString().equals(TreeNodeType.DEPENDENCY_GENERATED.name())) {
                leaf.setAttribute(SoftViz3dConstants.GRAPH_ATTR_NODES_COLOR, color.getHex());
            } else {
                leaf.setAttribute(SoftViz3dConstants.GRAPH_ATTR_NODES_COLOR, nodesColor.getHex());
            }

            leaf.setAttribute(SoftViz3dConstants.LAYER_HEIGHT_3D, height3d.toString());
        }
    }

    /**
     * As dot gets an exception when the building height attribute is set as a number,
     * we prefix the building height value with "x". This has to be removed in order to
     * parse the value in the view later.
     */
    private void fixBuildingHeight(Node leaf) {
        // there is an x at the beginning of the buildingHeight percent value
        String heightString = leaf.getAttributeValue(SoftViz3dConstants.GRAPH_ATTR_BUILDING_HEIGHT).toString();

        Double height = Double.valueOf(heightString.substring(1)) + MIN_BUILDING_HEIGHT;

        leaf.setAttribute(SoftViz3dConstants.GRAPH_ATTR_BUILDING_HEIGHT, height.toString());
    }

    /**
     * Building height is calculated in percent.
     *
     * @param value
     *            Metric value for the building size
     * @return percent 0-100%
     */
    @Override
    public double calcBuildingHeight(Double value, SonarMetric metricHeight) {
        double buildingHeight = 0.0;

        buildingHeight = calcPercentage(value, metricHeight, buildingHeight);

        return buildingHeight;
    }

    @Override
    public double calcSideLength(Double value, SonarMetric metricFootprint) {
        double sideLength = 0.0;

        sideLength = calcPercentage(value, metricFootprint, sideLength);

        if (sideLength < SoftViz3dConstants.MIN_SIDE_LENGTH_PERCENT) {
            sideLength = SoftViz3dConstants.MIN_SIDE_LENGTH_PERCENT;
        }

        return sideLength;
    }

    private double calcPercentage(Double value, SonarMetric metric, double sideLength) {
        if (value != null) {
            Double minValue = metric.getMinValue();
            Double maxValue = metric.getMaxValue();

            Double rangeSize = maxValue - minValue;
            if (rangeSize < 0) {
                LOGGER.error("Building calcPercentage range size below zero" + rangeSize);
            } else {
                if (value >= minValue && value <= maxValue) {
                    sideLength = 100 / rangeSize * (value - minValue);
                } else {
                    LOGGER.error("Building calcPercentage value not between min and max"
                            + minValue + " " + maxValue + " " + value);
                }
            }
        }
        return sideLength;
    }

}
