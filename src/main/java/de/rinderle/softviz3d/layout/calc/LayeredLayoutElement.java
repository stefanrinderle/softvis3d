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
package de.rinderle.softviz3d.layout.calc;

import de.rinderle.softviz3d.domain.tree.Edge;
import de.rinderle.softviz3d.domain.tree.TreeNode;
import de.rinderle.softviz3d.domain.tree.TreeNodeType;

import java.util.Map;

public final class LayeredLayoutElement {

  private final TreeNodeType type;

  private final Integer id;

  private final String name;

  private final Double width;
  private final Double height;
  private final Double buildingHeight;

  private final String displayName;

  private final Map<String, Edge> edges;

  private LayeredLayoutElement(final TreeNodeType type, final Integer id, final String name, final Double width,
    final Double height, final Double buildingHeight,
    final String displayName, final Map<String, Edge> edges) {
    super();
    this.type = type;
    this.id = id;
    this.name = name;
    this.width = width;
    this.height = height;
    this.buildingHeight = buildingHeight;
    this.displayName = displayName;
    this.edges = edges;
  }

  public static LayeredLayoutElement createLayeredLayoutLeafElement(
    final TreeNode node, final Double width, final Double height, final Double buildingHeight) {
    return createLayeredLayoutElement("file_", node, width, height, buildingHeight, node.getEdges());
  }

  public static LayeredLayoutElement createLayeredLayoutNodeElement(
    final TreeNode node, final Double width, final Double height, final Double buildingHeight) {
    return createLayeredLayoutElement("dir_", node, width, height, buildingHeight, node.getEdges());
  }

  private static LayeredLayoutElement createLayeredLayoutElement(
    final String namePrefix, final TreeNode node, final Double width, final Double height, final Double buildingHeight,
    final Map<String, Edge> edges) {
    return new LayeredLayoutElement(node.getType(), node.getId(), namePrefix
      + node.getId().toString(), width, height,
      buildingHeight, node.getName(), edges);
  }

  public TreeNodeType getElementType() {
    return this.type;
  }

  public Integer getId() {
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
}
