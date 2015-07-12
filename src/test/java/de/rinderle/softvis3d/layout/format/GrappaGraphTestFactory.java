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
package de.rinderle.softvis3d.layout.format;

import att.grappa.Edge;
import att.grappa.Graph;
import att.grappa.GrappaBox;
import att.grappa.GrappaConstants;
import att.grappa.GrappaLine;
import att.grappa.GrappaPoint;
import att.grappa.Node;
import de.rinderle.softvis3d.domain.SoftVis3DConstants;
import de.rinderle.softvis3d.domain.graph.ResultPlatform;
import de.rinderle.softvis3d.domain.tree.TreeNodeType;

public class GrappaGraphTestFactory {

  public static ResultPlatform createPlatform() {
    final Graph graph = new Graph("root");
    final double x = 0;
    final double y = 0;
    final double width = 50;
    final double height = 50;
    graph.setAttribute("bb", new GrappaBox(x, y, width, height));

    final Node leaf1 = new Node(graphLeaf1());
    leaf1.setAttribute("id", "2");
    leaf1.setAttribute(SoftVis3DConstants.GRAPH_ATTR_BUILDING_HEIGHT, "10");
    leaf1.setAttribute("type", TreeNodeType.TREE.name());
    leaf1.setAttribute(SoftVis3DConstants.SOFTVIZ_COLOR, "#ffffff");
    graph.addNode(leaf1);
    final Node leaf2 = new Node(graphLeaf2());
    leaf2.setAttribute("id", "3");
    leaf2.setAttribute(SoftVis3DConstants.GRAPH_ATTR_BUILDING_HEIGHT, "10");
    leaf2.setAttribute("type", TreeNodeType.TREE.name());
    leaf2.setAttribute(SoftVis3DConstants.SOFTVIZ_COLOR, "#ffffff");
    graph.addNode(leaf2);

    final Edge edge = new Edge(graph, leaf1, leaf2);
    GrappaPoint[] points = new GrappaPoint[3];
    points[0] = new GrappaPoint(0, 1);
    points[1] = new GrappaPoint(2, 3);
    points[2] = new GrappaPoint(100, 100);

    GrappaLine pos = new GrappaLine(points, 0);
    edge.setAttribute(GrappaConstants.POS_ATTR, pos);

    String radius = "x3.3";
    edge.setAttribute(SoftVis3DConstants.GRAPH_ATTR_EDGE_RADIUS, radius);

    leaf1.addEdge(edge, false);

    return new ResultPlatform(graph);
  }

  private static Graph graphLeaf1() {
    final Graph graph = new Graph("leaf1");
    final double x = 0;
    final double y = 0;
    final double width = 50;
    final double height = 50;
    graph.setAttribute("bb", new GrappaBox(x, y, width, height));
    return graph;
  }

  private static Graph graphLeaf2() {
    final Graph graph = new Graph("leaf2");
    final double x = 0;
    final double y = 0;
    final double width = 50;
    final double height = 50;
    graph.setAttribute("bb", new GrappaBox(x, y, width, height));
    return graph;
  }

}
