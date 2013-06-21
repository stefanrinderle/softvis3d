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
package de.rinderle.softviz3d.layout;

import att.grappa.Graph;
import att.grappa.Node;
import de.rinderle.softviz3d.helper.HexaColor;
import de.rinderle.softviz3d.layout.model.LayeredLayoutElement.Type;
import de.rinderle.softviz3d.layout.model.SourceObject;

public class ViewLayerCalculator {
//  private static final Logger LOGGER = LoggerFactory.getLogger(ViewLayerCalculator.class);

  private Graph graph;

  public Graph calculate(Graph graph, SourceObject source) {
    this.graph = graph;

    this.adjustLayoutToX3d(source.getDepth(), source.getId());

    return this.graph;
  }

  private void adjustLayoutToX3d(Integer depth, Integer snapshotId) {
    this.adjustGraph(graph, depth, snapshotId);

    for (Node node : graph.nodeElementsAsArray()) {
      /**
       * The nodes are not visualized. The will be represented with
       * the informations of the graph. 
       */
      if (node.getAttributeValue("type").toString().equals(Type.LEAF.name())) {
        this.adjustLeaf(node);
      }
    }
  }

  private void adjustLeaf(Node node) {
    double transparency = 0.0;
    HexaColor color = new HexaColor(255, 140, 0);

    node.setAttribute("color", color);
    node.setAttribute("transparency", transparency + "");
  }

  private void adjustGraph(Graph graph, Integer depth, Integer snapshotId) {
    double transparency = 0.0;

    // calc color
    int colorCalc = depth * 18;
    if (colorCalc > 155) {
      colorCalc = 155;
    }

    HexaColor color = new HexaColor(100 + colorCalc, 100 + colorCalc, 100 + colorCalc);

    graph.setAttribute("color", color);
    graph.setAttribute("transparency", transparency + "");
  }

}
