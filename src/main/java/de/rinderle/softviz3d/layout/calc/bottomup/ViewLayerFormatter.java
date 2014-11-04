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

import att.grappa.Edge;
import att.grappa.Graph;
import att.grappa.Node;
import de.rinderle.softviz3d.layout.calc.LayoutViewType;
import de.rinderle.softviz3d.layout.helper.HexaColor;
import de.rinderle.softviz3d.layout.interfaces.SoftViz3dConstants;
import de.rinderle.softviz3d.sonar.MinMaxValueDTO;
import de.rinderle.softviz3d.tree.TreeNodeType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static att.grappa.GrappaConstants.HEIGHT_ATTR;
import static att.grappa.GrappaConstants.WIDTH_ATTR;

public class ViewLayerFormatter implements LayerFormatter {

  private static final Logger LOGGER = LoggerFactory
    .getLogger(ViewLayerFormatter.class);

  private static final int MIN_BUILDING_HEIGHT = 10;

  @Override
  public void format(final Graph graph, final Integer depth, final LayoutViewType viewType) {
    // calc color
    int colorCalc = depth * 16;
    if (colorCalc > 154 || colorCalc < 0) {
      colorCalc = 154;
    }

    final HexaColor color = new HexaColor(100 + colorCalc, 100 + colorCalc, 100 + colorCalc);
    final HexaColor nodesColor = new HexaColor(254, 140, 0);

    graph.setAttribute(SoftViz3dConstants.GRAPH_ATTR_COLOR, color);

    double opacity = 1.0;
    Integer height3d = depth * 20;

    if (LayoutViewType.DEPENDENCY.equals(viewType)) {
      height3d = -(depth * 200);
      opacity = 0.7;
    }

    graph.setAttribute(SoftViz3dConstants.GRAPH_ATTR_OPACITY, opacity + "");

    graph.setAttribute(SoftViz3dConstants.LAYER_HEIGHT_3D, height3d.toString());

    for (final Node leaf : graph.nodeElementsAsArray()) {
      this.fixBuildingHeight(leaf);

      Double width = (Double) leaf.getAttributeValue(WIDTH_ATTR);
      // keep some distance to each other
      width = width * SoftViz3dConstants.DPI_DOT_SCALE;
      leaf.setAttribute(WIDTH_ATTR, this.roundTo2Decimals(width));

      Double height = (Double) leaf.getAttributeValue(HEIGHT_ATTR);
      // keep some distance to each other
      height = height * SoftViz3dConstants.DPI_DOT_SCALE;
      leaf.setAttribute(HEIGHT_ATTR, this.roundTo2Decimals(height));

      if (leaf.getAttribute("type").getValue().toString().equals(TreeNodeType.DEPENDENCY_GENERATED.name())) {
        leaf.setAttribute(SoftViz3dConstants.GRAPH_ATTR_NODES_COLOR, color.getHex());
      } else {
        leaf.setAttribute(SoftViz3dConstants.GRAPH_ATTR_NODES_COLOR, nodesColor.getHex());
      }

      leaf.setAttribute(SoftViz3dConstants.LAYER_HEIGHT_3D, height3d.toString());

      for (Edge edge : leaf.edgeElementsAsArray()) {
        if (edge.getTail().getId() == leaf.getId()) {
          // only process the edges which are on the start of the node,
          // otherwise each edge will be process multiple times.
          fixEdgeRadius(edge);
        }
      }
    }
  }

  private double roundTo2Decimals(final double value) {
    return Math.round(value * 100.0) / 100.0;
  }

  /**
   * As dot gets an exception when the edge radius attribute is set as a number,
   * we prefix the edge radius value with "x". This has to be removed in order to
   * parse the value in the view later.
   */
  private void fixEdgeRadius(final Edge edge) {
    // there is an x at the beginning of the buildingHeight percent value
    final String radiusString = edge.getAttributeValue("edgeRadius").toString();

    final Double radius;
    if ("x".equals(radiusString.substring(0, 1))) {
      radius = Double.valueOf(radiusString.substring(1));
      edge.setAttribute("edgeRadius", radius.toString());
    }
  }

  /**
   * As dot gets an exception when the building height attribute is set as a number,
   * we prefix the building height value with "x". This has to be removed in order to
   * parse the value in the view later.
   */
  private void fixBuildingHeight(final Node leaf) {
    // there is an x at the beginning of the buildingHeight percent value
    final String heightString = leaf.getAttributeValue(SoftViz3dConstants.GRAPH_ATTR_BUILDING_HEIGHT).toString();

    final Double height = Double.valueOf(heightString.substring(1)) + MIN_BUILDING_HEIGHT;

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
  public double calcBuildingHeight(final Double value, final MinMaxValueDTO minMaxMetricHeight) {
    double buildingHeight = this.calcPercentage(value, minMaxMetricHeight);

    return buildingHeight;
  }

  @Override
  public double calcSideLength(final Double value, final MinMaxValueDTO minMaxMetricFootprint) {
    double sideLength = this.calcPercentage(value, minMaxMetricFootprint);

    if (sideLength < SoftViz3dConstants.MIN_SIDE_LENGTH_PERCENT) {
      sideLength = SoftViz3dConstants.MIN_SIDE_LENGTH_PERCENT;
    }

    return sideLength;
  }

  @Override
  public double calcEdgeRadius(int counter, MinMaxValueDTO minMaxEdgeCounter) {
    double percentage = this.calcPercentage(Double.valueOf(counter), minMaxEdgeCounter);

    return percentage;
  }

  private double calcPercentage(final Double value, final MinMaxValueDTO minMaxDao) {
    double result = 0.0;
    if (value != null) {
      final Double minValue = minMaxDao.getMinValue();
      final Double maxValue = minMaxDao.getMaxValue();

      final Double rangeSize = maxValue - minValue;
      if (rangeSize < 0) {
        LOGGER.error("Building calcPercentage range size below zero" + rangeSize);
      } else {
        if (value >= minValue && value <= maxValue) {
          result = 100 / rangeSize * (value - minValue);
        } else {
          LOGGER.debug("Building calcPercentage value not between min and max"
            + minValue + " " + maxValue + " " + value);
        }
      }
    }
    return result;
  }

}
