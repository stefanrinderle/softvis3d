/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
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
package de.rinderle.softvis3d.domain.layout;

import att.grappa.Graph;
import att.grappa.Node;
import com.google.inject.Inject;
import de.rinderle.softvis3d.domain.SoftVis3DConstants;
import de.rinderle.softvis3d.domain.tree.Edge;
import de.rinderle.softvis3d.layout.format.LayerFormatter;

import static att.grappa.GrappaConstants.HEIGHT_ATTR;
import static att.grappa.GrappaConstants.LABEL_ATTR;
import static att.grappa.GrappaConstants.SHAPE_ATTR;
import static att.grappa.GrappaConstants.WIDTH_ATTR;

/**
 * This class is not a domain object. The methods should be integrated into LayeredLayoutElement domain object.
 */
public class GrappaTransformer {

  @Inject
  private LayerFormatter formatter;

  public Node transformToGrappaNode(final Graph inputGraph, final LayeredLayoutElement element) {
    final Node elementNode = new Node(inputGraph, element.getName());
    elementNode.setAttribute("id", element.getId().toString());
    elementNode.setAttribute("type", element.getElementType().name());
    elementNode.setAttribute(WIDTH_ATTR, this.roundTo2Decimals(element.getWidth()));
    elementNode.setAttribute(HEIGHT_ATTR, this.roundTo2Decimals(element.getHeight()));

    // keep the size of the node only dependent on the width and height
    // attribute and not from the node name
    elementNode.setAttribute(LABEL_ATTR, ".");
    elementNode.setAttribute(SHAPE_ATTR, "box");

    elementNode.setAttribute(SoftVis3DConstants.GRAPH_ATTR_BUILDING_HEIGHT, element.getBuildingHeight());

    elementNode.setAttribute(SoftVis3DConstants.SOFTVIZ_COLOR, element.getColor().getHex());

    elementNode.setAttribute("displayName", element.getDisplayName());
    return elementNode;
  }

  public att.grappa.Edge transformToGrappaEdge(final Graph inputGraph, final Edge edge) {
    final Node sourceNode = this.searchNodeById(inputGraph, edge.getSourceId());
    final Node destNode = this.searchNodeById(inputGraph, edge.getDestinationId());

    if (sourceNode != null && destNode != null) {
      final att.grappa.Edge result = new att.grappa.Edge(inputGraph, sourceNode, destNode);
      final double edgeRadius = this.formatter.calcEdgeRadius(edge.getIncludingDependenciesSize());
      result.setAttribute(SoftVis3DConstants.GRAPH_ATTR_EDGE_RADIUS, "x" + edgeRadius);
      result.setAttribute(SoftVis3DConstants.GRAPH_ATTR_PENWIDTH,
        String.valueOf(edge.getIncludingDependenciesSize()));

      return result;
    }

    return null;
  }

  private Node searchNodeById(final Graph inputGraph, final Integer sourceId) {
    for (final Node node : inputGraph.nodeElementsAsArray()) {
      final Integer nodeId = Integer.valueOf((String) node.getAttributeValue("id"));
      if (nodeId.equals(sourceId)) {
        return node;
      }
    }

    return null;
  }

  private double roundTo2Decimals(final double value) {
    return Math.round(value * 100.0) / 100.0;
  }

}
