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
package de.rinderle.softvis3d.base.layout.bottomup.grappa;

import att.grappa.Graph;
import att.grappa.GrappaConstants;
import att.grappa.Node;
import de.rinderle.softvis3d.base.domain.LayoutConstants;
import de.rinderle.softvis3d.base.domain.layout.LayeredLayoutElement;
import de.rinderle.softvis3d.base.domain.tree.TreeNode;
import de.rinderle.softvis3d.base.domain.tree.TreeNodeType;
import de.rinderle.softvis3d.base.layout.helper.HexaColor;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class GrappaNodeFactoryTest {

  @Test
  public void testTransformToGrappaNode() throws Exception {
    final Graph inputGraph = new Graph("graphName");

    final TreeNodeType type = TreeNodeType.TREE;
    final Integer id = 3;
    final String name = "elementName";
    final Double width = 42.4;
    final Double height = 23.4;
    final Double buildingHeight = 1.3;
    final HexaColor color = new HexaColor(0, 0, 0);

    final TreeNode node = new TreeNode(id, null, 0, type, name);
    final LayeredLayoutElement element =
      LayeredLayoutElement.createLayeredLayoutElement(node, width, height, buildingHeight, color);

    final Node result = new GrappaNodeFactory().transformToGrappaNode(inputGraph, element);

    assertEquals(id.toString(), result.getAttribute("id").getStringValue());
    assertEquals(type.name(), result.getAttribute("type").getStringValue());
    assertEquals(width, result.getAttribute(GrappaConstants.WIDTH_ATTR).getValue());
    assertEquals(height, result.getAttribute(GrappaConstants.HEIGHT_ATTR).getValue());

    assertEquals(".", result.getAttribute(GrappaConstants.LABEL_ATTR).getStringValue());
    assertEquals("box", result.getAttribute(GrappaConstants.SHAPE_ATTR).getStringValue());

    assertEquals("x" + buildingHeight,
      result.getAttribute(LayoutConstants.GRAPH_ATTR_BUILDING_HEIGHT).getStringValue());
    assertEquals(color.getHex(), result.getAttribute(LayoutConstants.SOFTVIZ_COLOR).getStringValue());
    assertEquals(element.getDisplayName(), result.getAttribute("displayName").getStringValue());
  }

}
