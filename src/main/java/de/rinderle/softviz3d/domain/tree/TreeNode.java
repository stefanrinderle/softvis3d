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
package de.rinderle.softviz3d.domain.tree;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;
import java.util.TreeMap;

public class TreeNode {

  private static final Logger LOGGER = LoggerFactory.getLogger(TreeNode.class);

  private int depth;
  private final Integer id;
  private TreeNodeType type;
  private TreeNode parent;
  private final double heightMetricValue;
  private final double footprintMetricValue;
  private String name;

  private Map<String, TreeNode> children = new TreeMap<String, TreeNode>();
  private Map<String, Edge> edges = new HashMap<String, Edge>();

  public TreeNode(final Integer id, final TreeNode parent, final int depth, final TreeNodeType type, final String name,
    final double footprintMetricValue,
    final double heightMetricValue) {
    this.id = id;
    this.parent = parent;
    this.depth = depth;
    this.name = name;
    this.type = type;
    this.footprintMetricValue = footprintMetricValue;
    this.heightMetricValue = heightMetricValue;
  }

  public Map<String, TreeNode> getChildren() {
    return this.children;
  }

  public boolean isNode() {
    return !this.children.isEmpty();
  }

  public Integer getId() {
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

  public double getHeightMetricValue() {
    return this.heightMetricValue;
  }

  public double getFootprintMetricValue() {
    return this.footprintMetricValue;
  }

  public String getName() {
    return this.name;
  }

  public void setName(final String name) {
    this.name = name;
  }

  public void setEdge(final Edge edge) {
    this.edges.put(edge.getDepEdgeLabel(), edge);
  }

  public boolean hasEdge(final String edgeLabel) {
    return this.edges.containsKey(edgeLabel);
  }

  public Edge getEdge(final String depEdgeLabel) {
    return this.edges.get(depEdgeLabel);
  }

  public Map<String, Edge> getEdges() {
    return this.edges;
  }

  public TreeNode findNode(Integer id) {
    return this.recursiveSearch(id, this);
  }

  public TreeNode findInterfaceLeafNode(final String label) {
    final Map<String, TreeNode> children = this.getChildren();

    if (children.containsKey(label)) {
      return children.get(label);
    } else {
      return null;
    }
  }

  /**
   * TODO: Could be placed somewhere else
   */
  private TreeNode recursiveSearch(final Integer id, final TreeNode treeNode) {
    if (treeNode.getId().equals(id)) {
      /**
       * check if there is a child treeNode with the same id.
       * This is to parse long paths and get the last treeNode
       * of the chain with the same id.
       */
      for (final TreeNode child : treeNode.getChildren().values()) {
        if (child.getId().equals(id)) {
          return this.recursiveSearch(id, child);
        }
      }

      return treeNode;
    }

    final Map<String, TreeNode> children = treeNode.getChildren();
    TreeNode temp;
    if (!children.isEmpty()) {
      for (final TreeNode child : children.values()) {
        temp = this.recursiveSearch(id, child);
        if (temp != null) {
          return temp;
        }
      }
    }

    return null;
  }
}
