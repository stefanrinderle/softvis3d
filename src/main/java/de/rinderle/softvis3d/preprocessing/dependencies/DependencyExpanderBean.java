/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.preprocessing.dependencies;

import de.rinderle.softvis3d.domain.sonar.SonarDependency;
import de.rinderle.softvis3d.domain.tree.Edge;
import de.rinderle.softvis3d.domain.tree.TreeNode;
import de.rinderle.softvis3d.domain.tree.TreeNodeType;

import java.util.List;

public class DependencyExpanderBean implements DependencyExpander {

  public static final String INTERFACE_PREFIX = "interface";
  private static final String DEP_PATH_EDGE_PREFIX = "depPath";

  private int maxEdgeCounter;

  private int generatedIdSequence = Integer.MAX_VALUE - 1000000;

  public int execute(final TreeNode treeRootNode, final List<SonarDependency> dependencies) {
    this.maxEdgeCounter = 1;

    for (final SonarDependency dependency : dependencies) {

      final Integer sourceId = dependency.getFromSnapshotId();
      final Integer destinationId = dependency.getToSnapshotId();

      // search for the common ancestor
      final TreeNode source = treeRootNode.findNode(sourceId);
      final TreeNode destination = treeRootNode.findNode(destinationId);

      final DependencyType dependencyType = this.getDependencyType(source, destination);

      if (dependencyType.equals(DependencyType.INPUT_FLAT)) {
        this.handleNewFlatDepEdge(source, destination);
      } else if (dependencyType.equals(DependencyType.INPUT_TREE)) {
        this.createDependencyPath(source, destination);
      } else {
        // do nothing. That's on dependency type dir. Analyse and fix.
      }
    }

    return this.maxEdgeCounter;
  }

  private DependencyType getDependencyType(final TreeNode from, final TreeNode to) {
    // TODO check this - should be if a dependency to a dir was given.
    if (from == null || to == null) {
      return DependencyType.DIR;
    } else {
      final boolean hasSameParent = from.getParent().getId().equals(to.getParent().getId());

      if (hasSameParent) {
        return DependencyType.INPUT_FLAT;
      } else {
        return DependencyType.INPUT_TREE;
      }
    }
  }

  private void createDependencyPath(TreeNode source, TreeNode dest) {
    while (!source.getParent().getId().equals(dest.getParent().getId())) {
      if (source.getDepth() > dest.getDepth()) {
        this.handleNewDepEdge(source, true);
        source = source.getParent();
      } else {
        this.handleNewDepEdge(dest, false);
        dest = dest.getParent();
      }
    }

    // compute till both have the same parent
    while (!source.getParent().getId().equals(dest.getParent().getId())) {
      if (source.getDepth() > dest.getDepth()) {
        this.handleNewDepEdge(source, true);
        source = source.getParent();
      } else {
        this.handleNewDepEdge(dest, false);
        dest = dest.getParent();
      }
    }

    this.handleNewFlatDepEdge(source, dest);
  }

  private void handleNewFlatDepEdge(final TreeNode source, final TreeNode dest) {
    final String depEdgeLabel = DEP_PATH_EDGE_PREFIX + "_" + source.getId();

    if (source.hasEdge(depEdgeLabel)) {
      final Edge edge = source.getEdge(depEdgeLabel);
      final int edgeCount = edge.getCounter() + 1;
      edge.setCounter(edgeCount);

      if (edgeCount > this.maxEdgeCounter) {
        this.maxEdgeCounter = edgeCount;
      }

      source.setEdge(edge);
    } else {
      final Edge edge = new Edge(depEdgeLabel,
        source.getId(), dest.getId(), source.getParent().getId());
      source.setEdge(edge);
    }
  }

  private void handleNewDepEdge(final TreeNode treeNode, final boolean isOut) {
    final String depEdgeLabel = DEP_PATH_EDGE_PREFIX + "_" + treeNode.getId();
    // always attach edge to source node
    if (isOut) {
      // treeNode is source
      if (treeNode.hasEdge(depEdgeLabel)) {
        final Edge edge = treeNode.getEdge(depEdgeLabel);
        final int edgeCount = edge.getCounter() + 1;
        edge.setCounter(edgeCount);

        if (edgeCount > this.maxEdgeCounter) {
          this.maxEdgeCounter = edgeCount;
        }

        treeNode.setEdge(edge);
      } else {
        final TreeNode depNode = this.getInterfaceNode(treeNode.getParent());

        final Edge element = new Edge(depEdgeLabel, treeNode.getId(), depNode.getId(), treeNode.getParent().getId());

        treeNode.setEdge(element);
      }
    } else {
      // interface node is source
      final TreeNode depNode = this.getInterfaceNode(treeNode.getParent());
      if (depNode.hasEdge(depEdgeLabel)) {
        final Edge edge = depNode.getEdge(depEdgeLabel);
        edge.setCounter(edge.getCounter() + 1);
        depNode.setEdge(edge);
      } else {
        final Edge element = new Edge(depEdgeLabel, depNode.getId(), treeNode.getId(), treeNode.getParent().getId());
        depNode.setEdge(element);
      }
    }
  }

  private TreeNode getInterfaceNode(final TreeNode parent) {
    final TreeNode result;
    final String intLeafLabel = INTERFACE_PREFIX + "_" + parent.getId();

    final TreeNode treeNode = parent.findInterfaceLeafNode(intLeafLabel);

    if (treeNode == null) {
      result = this.addInterfaceLeafNode(intLeafLabel, parent);
    } else {
      result = treeNode;
    }

    return result;
  }

  private TreeNode addInterfaceLeafNode(final String intLeafLabel, final TreeNode parent) {
    final Integer id = this.getNextSequence();
    final TreeNode interfaceLeafTreeNode = new TreeNode(id, parent, parent.getDepth() + 1,
      TreeNodeType.DEPENDENCY_GENERATED, "elevatorNode_" + id, 0, 0);
    parent.getChildren().put(intLeafLabel, interfaceLeafTreeNode);

    return interfaceLeafTreeNode;
  }

  private int getNextSequence() {
    this.generatedIdSequence = this.generatedIdSequence + 1;
    return this.generatedIdSequence;
  }
}
