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
package de.rinderle.softvis3d.layout.bottomup.grappa;

import att.grappa.Graph;
import att.grappa.Node;
import de.rinderle.softvis3d.domain.LayoutConstants;
import de.rinderle.softvis3d.domain.layout.LayeredLayoutElement;

import static att.grappa.GrappaConstants.HEIGHT_ATTR;
import static att.grappa.GrappaConstants.LABEL_ATTR;
import static att.grappa.GrappaConstants.SHAPE_ATTR;
import static att.grappa.GrappaConstants.WIDTH_ATTR;

public class GrappaNodeFactory {

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

    elementNode.setAttribute(LayoutConstants.GRAPH_ATTR_BUILDING_HEIGHT, element.getBuildingHeight());

    elementNode.setAttribute(LayoutConstants.SOFTVIZ_COLOR, element.getColor().getHex());

    elementNode.setAttribute("displayName", element.getDisplayName());
    return elementNode;
  }

  private double roundTo2Decimals(final double value) {
    return Math.round(value * 100.0) / 100.0;
  }

}
