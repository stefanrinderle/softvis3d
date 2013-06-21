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

import de.rinderle.softviz3d.layout.dot.DotExcecutor;
import de.rinderle.softviz3d.layout.dot.DotExcecutorException;

import de.rinderle.softviz3d.layout.helper.LayeredLayoutElement;
import de.rinderle.softviz3d.layout.helper.LayeredLayoutElement.Type;

import de.rinderle.softviz3d.layout.interfaces.LayoutConstants;

import de.rinderle.softviz3d.layout.interfaces.SourceMetric;
import de.rinderle.softviz3d.layout.interfaces.SourceObject;

import att.grappa.Graph;
import att.grappa.GrappaBox;
import att.grappa.Node;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import static att.grappa.GrappaConstants.HEIGHT_ATTR;
import static att.grappa.GrappaConstants.WIDTH_ATTR;

public class LayoutVisitor {
  // private static final Logger LOGGER = LoggerFactory.getLogger(LayoutVisitor.class);

  private SourceMetric metricFootprint;

  public LayoutVisitor(SourceMetric metricFootprint) {
    this.metricFootprint = metricFootprint;
  }
  
  private ViewLayerCalculator calculator = new ViewLayerCalculator();

  private Map<Integer, Graph> resultingGraphList = new HashMap<Integer, Graph>();

  private static final double BASE_SIDE_LENGTH = 1;

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
      inputGraph.addNode(elementNode);
    }

    // run dot layout for this layer
    Graph outputGraph = DotExcecutor.run(inputGraph);

    // adjust graph
    Graph adjustedGraph = calculator.calculate(outputGraph, source);
    resultingGraphList.put(source.getId(), adjustedGraph);

    // adjusted graph has a bounding box !
    GrappaBox bb = (GrappaBox) adjustedGraph.getAttributeValue("bb");

    // Scale
    Double width = bb.getWidth() / LayoutConstants.DPI_DOT_SCALE;
    Double height = bb.getHeight() / LayoutConstants.DPI_DOT_SCALE;

    return new LayeredLayoutElement(LayeredLayoutElement.Type.NODE, source.getId(), "dir_" + source.getId(), width, height);
  }

  public LayeredLayoutElement visitFile(SourceObject source) {
    double sideLength = BASE_SIDE_LENGTH;
    
    Double value = source.getMetricFootprint();
    
    if (value != null) {
      if (metricFootprint.getWorstValue() != null) {
        // if there is a worst value, there is also a best value available
      } else if (metricFootprint.getBestValue() != null) {
        //
      } else {
        sideLength = source.getMetricFootprint();
      }
    }  
    
    return new LayeredLayoutElement(Type.LEAF, source.getId(), 
            "file_" + source.getId().toString(),
            sideLength, sideLength);
  }
}
