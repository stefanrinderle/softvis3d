/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.domain.layout;

import de.rinderle.softvis3d.domain.tree.Edge;
import de.rinderle.softvis3d.domain.tree.TreeNode;
import de.rinderle.softvis3d.domain.tree.TreeNodeType;

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

  public static LayeredLayoutElement createLayeredLayoutElement(
    final TreeNode node, final Double width, final Double height, final Double buildingHeight) {
    return new LayeredLayoutElement(node.getType(), node.getId(),
      node.getId().toString(), width, height,
      buildingHeight, node.getName(), node.getEdges());
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
