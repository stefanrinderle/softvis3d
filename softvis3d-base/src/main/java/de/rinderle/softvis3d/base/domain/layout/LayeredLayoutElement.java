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
package de.rinderle.softvis3d.base.domain.layout;

import de.rinderle.softvis3d.base.domain.tree.Edge;
import de.rinderle.softvis3d.base.domain.tree.TreeNode;
import de.rinderle.softvis3d.base.domain.tree.TreeNodeType;
import de.rinderle.softvis3d.base.layout.helper.HexaColor;
import java.util.Map;

public final class LayeredLayoutElement {

  private final TreeNodeType type;

  private final String id;

  private final String name;

  private final Double width;
  private final Double height;
  private final Double buildingHeight;

  private final String displayName;

  private final Map<String, Edge> edges;
  private final HexaColor color;

  private LayeredLayoutElement(final TreeNodeType type, final String id, final String name, final Double width,
    final Double height, final Double buildingHeight, final String displayName, final Map<String, Edge> edges,
    final HexaColor color) {
    super();
    this.type = type;
    this.id = id;
    this.name = name;
    this.width = width;
    this.height = height;
    this.buildingHeight = buildingHeight;
    this.displayName = displayName;
    this.edges = edges;
    this.color = color;
  }

  public static LayeredLayoutElement createLayeredLayoutElement(final TreeNode node, final Double width,
    final Double height, final Double buildingHeight, final HexaColor color) {
    return new LayeredLayoutElement(node.getType(), node.getId(), node.getId().toString(), width, height,
      buildingHeight, node.getName(), node.getEdges(), color);
  }

  public TreeNodeType getElementType() {
    return this.type;
  }

  public String getId() {
    return this.id;
  }

  public String getName() {
    return this.name;
  }

  public Double getWidth() {
    return this.width;
  }

  public Double getHeight() {
    return this.height;
  }

  public String getBuildingHeight() {
    return "x" + this.buildingHeight;
  }

  public String getDisplayName() {
    return this.displayName;
  }

  public Map<String, Edge> getEdges() {
    return this.edges;
  }

  public HexaColor getColor() {
    return color;
  }

  @Override
  public String toString() {
    return "LayeredLayoutElement{" +
        "type=" + type +
        ", id=" + id +
        ", name='" + name + '\'' +
        ", width=" + width +
        ", height=" + height +
        ", buildingHeight=" + buildingHeight +
        ", displayName='" + displayName + '\'' +
        ", edges=" + edges +
        ", color=" + color +
        '}';
  }
}
