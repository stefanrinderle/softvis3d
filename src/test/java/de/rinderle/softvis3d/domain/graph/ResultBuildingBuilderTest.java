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
package de.rinderle.softvis3d.domain.graph;

import att.grappa.Edge;
import att.grappa.Graph;
import att.grappa.GrappaConstants;
import att.grappa.GrappaLine;
import att.grappa.GrappaPoint;
import att.grappa.Node;
import att.grappa.Subgraph;
import de.rinderle.softvis3d.domain.SoftVis3DConstants;
import de.rinderle.softvis3d.domain.tree.TreeNodeType;
import de.rinderle.softvis3d.layout.helper.HexaColor;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

/**
 * Created by stefan on 31.05.15.
 */
public class ResultBuildingBuilderTest {

  @Test
  public void testNodeAttributes() {
    Subgraph graph = new Graph("rootNode");
    Node node = new Node(graph, "testNode");

    node.setAttribute("id", "123");
    node.setAttribute(GrappaConstants.WIDTH_ATTR, "300.4");
    node.setAttribute(GrappaConstants.HEIGHT_ATTR, "400.3");

    node.setAttribute(SoftVis3DConstants.GRAPH_ATTR_BUILDING_HEIGHT, "x10.3");

    HexaColor color = new HexaColor(254, 140, 0);
    node.setAttribute(SoftVis3DConstants.SOFTVIZ_COLOR, color.getHex());

    TreeNodeType type = TreeNodeType.PATH_GENERATED;
    node.setAttribute("type", type.name());

    node.setAttribute(GrappaConstants.POS_ATTR, new GrappaPoint(1, 2));

    ResultBuilding result = new ResultBuildingBuilder().withNode(node).createResultBuilding();

    assertEquals(123, result.getId());

    assertEquals(300.4, result.getWidth(), 0.001);
    assertEquals(400.3, result.getHeight(), 0.001);
    assertEquals(10.3, result.getBuildingHeight(), 0.001);

    assertEquals(color, result.getColor());
    assertEquals(type, result.getType());

    assertEquals(1, result.getPosition().getX(), 0.001);
    assertEquals(2, result.getPosition().getY(), 0.001);
  }

  @Test
  public void testNodeEdgesAttributes() {
    Subgraph graph = new Graph("rootNode");
    Node node = new Node(graph, "testNode");

    node.setAttribute("id", "123");
    node.setAttribute(SoftVis3DConstants.GRAPH_ATTR_BUILDING_HEIGHT, "x10.3");
    node.setAttribute(SoftVis3DConstants.SOFTVIZ_COLOR, new HexaColor(254, 140, 0).getHex());
    node.setAttribute("type", TreeNodeType.PATH_GENERATED.name());

    Node secondNode = new Node(graph, "secondTestNode");

    final Edge out = new Edge(graph, node, secondNode);
    setEdgeAttributes(out);
    final Edge in = new Edge(graph, secondNode, node);
    setEdgeAttributes(in);

    node.addEdge(out, false);
    node.addEdge(in, true);

    ResultBuilding result = new ResultBuildingBuilder().withNode(node).createResultBuilding();

    // TODO: Seems that there is a bug in the addEdge method. Returns 2 same edges.
    // But addEdge is never used in this application. Jst used for test cases.
    assertEquals(2, result.getArrows().size());
    assertEquals("secondTestNode", result.getArrows().get(0).getHeadId());
    assertEquals("testNode", result.getArrows().get(0).getTailId());
  }

  private void setEdgeAttributes(Edge edge) {
    GrappaPoint[] points = new GrappaPoint[3];
    points[0] = new GrappaPoint(0, 1);
    points[1] = new GrappaPoint(2, 3);
    points[2] = new GrappaPoint(100, 100);

    GrappaLine pos = new GrappaLine(points, 0);
    edge.setAttribute(GrappaConstants.POS_ATTR, pos);

    String radius = "x3.3";
    edge.setAttribute(SoftVis3DConstants.GRAPH_ATTR_EDGE_RADIUS, radius);
  }

}