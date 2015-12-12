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
package de.rinderle.softvis3d.base.layout.bottomup.grappa;

import att.grappa.Graph;
import att.grappa.Node;
import com.google.inject.Inject;
import de.rinderle.softvis3d.base.domain.LayoutConstants;
import de.rinderle.softvis3d.base.domain.tree.Edge;
import de.rinderle.softvis3d.base.layout.format.LayerFormatter;

public class GrappaEdgeFactory {

  @Inject
  private LayerFormatter formatter;

  public att.grappa.Edge createGrappaEdge(final Graph inputGraph, final Edge edge) {
    final Node sourceNode = this.searchNodeById(inputGraph, edge.getSourceId());
    final Node destNode = this.searchNodeById(inputGraph, edge.getDestinationId());

    if (sourceNode == null || destNode == null) {
      throw new IllegalArgumentException();
    } else {
      final att.grappa.Edge result = new att.grappa.Edge(inputGraph, sourceNode, destNode);
      final double edgeRadius = this.formatter.calcEdgeRadius(edge.getIncludingDependenciesSize());
      result.setAttribute(LayoutConstants.GRAPH_ATTR_EDGE_RADIUS, "x" + edgeRadius);
      result.setAttribute(LayoutConstants.GRAPH_ATTR_PENWIDTH,
        String.valueOf(edge.getIncludingDependenciesSize()));

      return result;
    }
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

}
