/*
 * softvis3d-base
 * Copyright (C) 2015 Stefan Rinderle
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
package de.rinderle.softvis3d.base.domain.graph;

import att.grappa.Graph;
import att.grappa.GrappaConstants;
import att.grappa.GrappaPoint;
import att.grappa.Node;
import att.grappa.Subgraph;
import de.rinderle.softvis3d.base.domain.LayoutConstants;
import de.rinderle.softvis3d.base.domain.tree.TreeNodeType;
import de.rinderle.softvis3d.base.layout.helper.HexaColor;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class ResultBuildingBuilderTest {

  @Test
  public void testNodeAttributes() {
    final Subgraph graph = new Graph("rootNode");
    final Node node = new Node(graph, "testNode");

    node.setAttribute("id", "123");
    node.setAttribute(GrappaConstants.WIDTH_ATTR, "300.4");
    node.setAttribute(GrappaConstants.HEIGHT_ATTR, "400.3");

    node.setAttribute(LayoutConstants.GRAPH_ATTR_BUILDING_HEIGHT, "x10.3");

    final HexaColor color = new HexaColor(254, 140, 0);
    node.setAttribute(LayoutConstants.SOFTVIZ_COLOR, color.getHex());

    final TreeNodeType type = TreeNodeType.PATH_GENERATED;
    node.setAttribute("type", type.name());

    node.setAttribute(GrappaConstants.POS_ATTR, new GrappaPoint(1, 2));

    final ResultBuilding result = new ResultBuildingBuilder().withNode(node).createResultBuilding();

    assertEquals("123", result.getId());

    assertEquals(300.4, result.getWidth(), 0.001);
    assertEquals(400.3, result.getHeight(), 0.001);
    assertEquals(10.3, result.getBuildingHeight(), 0.001);

    assertEquals(color, result.getColor());
    assertEquals(type, result.getType());

    assertEquals(1, result.getPosition().getX(), 0.001);
    assertEquals(2, result.getPosition().getY(), 0.001);
  }

}
