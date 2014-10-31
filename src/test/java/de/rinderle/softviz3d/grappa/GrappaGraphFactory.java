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
package de.rinderle.softviz3d.grappa;

import att.grappa.Graph;
import att.grappa.GrappaBox;
import att.grappa.Node;
import de.rinderle.softviz3d.layout.interfaces.SoftViz3dConstants;
import de.rinderle.softviz3d.tree.TreeNodeType;

public class GrappaGraphFactory {

  public static Graph createGraph() {
    final Graph graph = new Graph("root");
    final double x = 0;
    final double y = 0;
    final double width = 50;
    final double height = 50;
    graph.setAttribute("bb", new GrappaBox(x, y, width, height));

    final Node leaf1 = new Node(graphLeaf1());
    leaf1.setAttribute("id", "2");
    leaf1.setAttribute(SoftViz3dConstants.GRAPH_ATTR_BUILDING_HEIGHT, "10");
    leaf1.setAttribute("type", TreeNodeType.TREE.name());
    graph.addNode(leaf1);
    final Node leaf2 = new Node(graphLeaf2());
    leaf2.setAttribute("id", "3");
    leaf2.setAttribute(SoftViz3dConstants.GRAPH_ATTR_BUILDING_HEIGHT, "10");
    leaf2.setAttribute("type", TreeNodeType.TREE.name());
    graph.addNode(leaf2);

    return graph;
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
