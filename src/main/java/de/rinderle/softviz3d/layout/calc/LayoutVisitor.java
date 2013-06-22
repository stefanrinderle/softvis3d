/*
 * SoftViz3d Sonar plugin
 * Copyright (C) 2013 Stefan Rinderle
 * dev@sonar.codehaus.org
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
package de.rinderle.softviz3d.layout.calc;

import att.grappa.Graph;
import att.grappa.GrappaBox;
import att.grappa.Node;
import de.rinderle.softviz3d.layout.dot.DotExcecutor;
import de.rinderle.softviz3d.layout.dot.DotExcecutorException;
import de.rinderle.softviz3d.layout.helper.LayeredLayoutElement;
import de.rinderle.softviz3d.layout.helper.LayeredLayoutElement.Type;
import de.rinderle.softviz3d.layout.interfaces.LayoutConstants;
import de.rinderle.softviz3d.layout.interfaces.SourceMetric;
import de.rinderle.softviz3d.layout.interfaces.SourceObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static att.grappa.GrappaConstants.HEIGHT_ATTR;
import static att.grappa.GrappaConstants.LABEL_ATTR;
import static att.grappa.GrappaConstants.SHAPE_ATTR;
import static att.grappa.GrappaConstants.WIDTH_ATTR;

public class LayoutVisitor {
  private static final Logger LOGGER = LoggerFactory.getLogger(LayoutVisitor.class);

  private SourceMetric metricFootprint;
  private SourceMetric metricHeight;

  private ViewLayerFormatter formatter = new ViewLayerFormatter();

  private Map<Integer, Graph> resultingGraphList = new HashMap<Integer, Graph>();

  public LayoutVisitor(SourceMetric metricFootprint, SourceMetric metricHeight) {
    this.metricFootprint = metricFootprint;
    this.metricHeight = metricHeight;
  }

  public Map<Integer, Graph> getResultingGraphList() {
    return this.resultingGraphList;
  }

  public LayeredLayoutElement visitNode(SourceObject source, List<LayeredLayoutElement> elements)
      throws DotExcecutorException {
    // create layout graph
    Graph inputGraph = new Graph(source.getId().toString());

    for (LayeredLayoutElement element : elements) {
      Node elementNode = new Node(inputGraph, element.getName());
      elementNode.setAttribute("id", element.getId().toString());
      elementNode.setAttribute("type", element.getElementType().name());
      elementNode.setAttribute(WIDTH_ATTR, element.getWidth());
      elementNode.setAttribute(HEIGHT_ATTR, element.getHeight());

      // keep the size of the node only dependend on the width and height attribute
      // and not from the node name
      elementNode.setAttribute(LABEL_ATTR, ".");

      elementNode.setAttribute(SHAPE_ATTR, "box");

      elementNode.setAttribute("buildingHeight", element.getBuildingHeight().toString());

      elementNode.setAttribute("displayName", element.getDisplayName());
      
      inputGraph.addNode(elementNode);
    }

    // run dot layout for this layer
    Graph outputGraph = DotExcecutor.run(inputGraph);

    // adjust graph
    Graph adjustedGraph = formatter.format(outputGraph, source.getDepth());
    resultingGraphList.put(source.getId(), adjustedGraph);

    // adjusted graph has a bounding box !
    GrappaBox bb = (GrappaBox) adjustedGraph.getAttributeValue("bb");

    // The dot output of the bb is given in DPI. The actual width
    // and height of the representing element has to be scaled
    // back to normal
    Double width = bb.getWidth() / LayoutConstants.DPI_DOT_SCALE;
    Double height = bb.getHeight() / LayoutConstants.DPI_DOT_SCALE;

    double buildingHeight = 2;

    return new LayeredLayoutElement(LayeredLayoutElement.Type.NODE, source.getId(), "dir_" + source.getId(), width, height, buildingHeight, source.getName());
  }

  public LayeredLayoutElement visitFile(SourceObject source) {
    double sideLength = calcSideLength(source.getMetricFootprint());

    double buildingHeight = calcBuildingHeight(source.getMetricHeight());

    return new LayeredLayoutElement(Type.LEAF, source.getId(),
        "file_" + source.getId().toString(), 
        sideLength, sideLength, buildingHeight, source.getName());
  }

  /**
   * Building height is calculated in percent.
   * 
   * The actual building size is dependent on the size 
   * of the biggest layer. This value is not available
   * at this point of the calculation.
   * 
   * @param value Metric value for the building size
   * @return percent 0-100%
   */
  private double calcBuildingHeight(Double value) {
    double buildingHeight = 0.0;

    if (value != null) {
      // TODO start with 0 percent also in case of starting higher
      Double maxValue = metricHeight.getMaxValue();

      Double valuePercent = 0.0;
      if (maxValue > 0 && value > 0) {
        valuePercent = LayoutConstants.PERCENT_DIVISOR / maxValue * value;
      }

      buildingHeight = valuePercent;
    }

    return buildingHeight;
  }

  private double calcSideLength(Double value) {
    double sideLength = LayoutConstants.MIN_SIDE_LENGTH;

    if (value != null) {
      // TODO start with 0 percent also in case of starting higher
      // Double minValue = metricFootprint.getMinValue();
      Double maxValue = metricFootprint.getMaxValue();

      // create a linear distribution
      Double onePercent = (LayoutConstants.MAX_SIDE_LENGTH - LayoutConstants.MIN_SIDE_LENGTH) / LayoutConstants.PERCENT_DIVISOR;
      Double valuePercent = 0.0;
      if (maxValue > 0 && value > 0) {
        valuePercent = LayoutConstants.PERCENT_DIVISOR / maxValue * value;
      }

      sideLength = LayoutConstants.MIN_SIDE_LENGTH + valuePercent * onePercent;
    }

    return sideLength;
  }

}
