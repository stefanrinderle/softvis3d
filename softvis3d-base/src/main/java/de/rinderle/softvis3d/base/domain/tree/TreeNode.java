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
package de.rinderle.softvis3d.base.domain.tree;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

public class TreeNode {

  private final String id;
  private final TreeNodeType type;
  private final Map<String, TreeNode> children = new TreeMap<>();
  private String name;
  private TreeNode parent;
  private int depth;

  public TreeNode(final String id, final TreeNode parent, final int depth, final TreeNodeType type, final String name) {
    this.id = id;
    this.parent = parent;
    this.depth = depth;
    this.name = name;
    this.type = type;
  }

  public Map<String, TreeNode> getChildren() {
    return this.children;
  }

  public boolean isNode() {
    return !this.children.isEmpty();
  }

  public String getId() {
    return this.id;
  }

  public TreeNode getParent() {
    return this.parent;
  }

  public void setParent(final TreeNode parent) {
    this.parent = parent;
  }

  public Integer getDepth() {
    return this.depth;
  }

  public void setDepth(final Integer depth) {
    this.depth = depth;
  }

  public TreeNodeType getType() {
    return this.type;
  }

  public String getName() {
    return this.name;
  }

  public void setName(final String name) {
    this.name = name;
  }

  public int getAllChildrenNodesSize() {
    int result = 0;

    result += this.getChildrenNodes().size();
    for (final TreeNode node : this.getChildrenNodes()) {
      result += node.getAllChildrenNodesSize();
    }

    return result;
  }

  public List<ValueTreeNode> getAllChildrenValueLeaves() {
    final List<ValueTreeNode> result = new ArrayList<>();

    for (final TreeNode leaf : this.getChildrenLeaves()) {
      if (leaf instanceof ValueTreeNode) {
        result.add((ValueTreeNode) leaf);
      }
    }

    for (final TreeNode node : this.getChildrenNodes()) {
      result.addAll(node.getAllChildrenValueLeaves());
    }

    return result;
  }

  public List<TreeNode> getChildrenNodes() {
    final List<TreeNode> result = new ArrayList<>();

    for (final TreeNode child : children.values()) {
      if (!child.getChildren().isEmpty()) {
        result.add(child);
      }
    }

    return result;
  }

  public List<TreeNode> getChildrenLeaves() {
    final List<TreeNode> result = new ArrayList<>();

    for (final TreeNode child : children.values()) {
      if (child.getChildren().isEmpty()) {
        result.add(child);
      }
    }

    return result;
  }

  public void addChildrenNode(final String name, final TreeNode child) {
    children.put(name, child);
  }

}
