/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.domain.tree;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;

public class TreeNode {

  private static final Logger LOGGER = LoggerFactory.getLogger(TreeNode.class);

  private final Integer id;
  private String name;

  private TreeNode parent;
  private int depth;
  private TreeNodeType type;

  private Map<String, TreeNode> children = new TreeMap<String, TreeNode>();
  private Map<String, Edge> edges = new HashMap<String, Edge>();

  public TreeNode(final Integer id, final TreeNode parent, final int depth, final TreeNodeType type, final String name) {
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

  public DependencyTreeNode findInterfaceLeafNode(final String label) {
    final Map<String, TreeNode> children = this.getChildren();

    if (children.containsKey(label)) {
      return (DependencyTreeNode) children.get(label);
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

  public List<TreeNode> getChildrenNodes() {
    final List<TreeNode> result = new ArrayList<TreeNode>();

    for (final TreeNode child : children.values()) {
      if (!child.getChildren().isEmpty()) {
        result.add(child);
      }
    }

    return result;
  }

  public List<TreeNode> getChildrenLeaves() {
    final List<TreeNode> result = new ArrayList<TreeNode>();

    for (final TreeNode child : children.values()) {
      if (child.getChildren().isEmpty()) {
        result.add(child);
      }
    }

    return result;
  }

}
