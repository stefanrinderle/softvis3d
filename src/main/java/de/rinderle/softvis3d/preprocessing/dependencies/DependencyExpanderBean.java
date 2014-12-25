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
import de.rinderle.softvis3d.domain.tree.*;

import java.math.BigInteger;
import java.util.List;

public class DependencyExpanderBean implements DependencyExpander {

  public static final String INTERFACE_PREFIX = "interface";
  private static final String DEP_PATH_EDGE_PREFIX = "depPath";

  private int maxEdgeCounter;

  private int generatedIdSequence = Integer.MAX_VALUE - 1000000;

  public int execute(final RootTreeNode treeRootNode, final List<SonarDependency> dependencies) {
    this.maxEdgeCounter = 1;

    for (final SonarDependency dependency : dependencies) {
      final Integer sourceId = dependency.getFromSnapshotId();
      final Integer destinationId = dependency.getToSnapshotId();

      // search for the common ancestor
      final TreeNode source = treeRootNode.findNode(sourceId);
      final TreeNode destination = treeRootNode.findNode(destinationId);

      final DependencyType dependencyType = this.getDependencyType(source, destination);

      if (dependencyType.equals(DependencyType.INPUT_FLAT)) {
        this.handleNewFlatDepEdge(source, destination, dependency.getId());
      } else if (dependencyType.equals(DependencyType.INPUT_TREE)) {
        this.createDependencyPath(source, destination, dependency.getId());
      } else {
        // do nothing. That's on dependency type dir. Analyse and fix.
      }

      Dependency treeDependency = new Dependency(dependency.getId(), sourceId,
              source.getName(), destinationId, destination.getName());
      treeRootNode.addDependency(treeDependency);
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

  private void createDependencyPath(TreeNode source, TreeNode dest, final BigInteger dependencyId) {
    while (!source.getParent().getId().equals(dest.getParent().getId())) {
      if (source.getDepth() > dest.getDepth()) {
        this.handleNewDepEdge(source, dependencyId, true);
        source = source.getParent();
      } else {
        this.handleNewDepEdge(dest, dependencyId, false);
        dest = dest.getParent();
      }
    }

    // compute till both have the same parent
    while (!source.getParent().getId().equals(dest.getParent().getId())) {
      if (source.getDepth() > dest.getDepth()) {
        this.handleNewDepEdge(source, dependencyId, true);
        source = source.getParent();
      } else {
        this.handleNewDepEdge(dest, dependencyId, false);
        dest = dest.getParent();
      }
    }

    this.handleNewFlatDepEdge(source, dest, dependencyId);
  }

  private void handleNewFlatDepEdge(final TreeNode source, final TreeNode dest, final BigInteger dependencyId) {
    final String depEdgeLabel = DEP_PATH_EDGE_PREFIX + "_" + source.getId();

    Edge edge;
    if (source.hasEdge(depEdgeLabel)) {
      edge = source.getEdge(depEdgeLabel);
      final int edgeCount = edge.getIncludingDependenciesSize() + 1;
      if (edgeCount > this.maxEdgeCounter) {
        this.maxEdgeCounter = edgeCount;
      }

      source.setEdge(edge);
    } else {
      edge = new Edge(depEdgeLabel,
        source.getId(), dest.getId(), source.getParent().getId());
      source.setEdge(edge);
    }

    edge.addIncludingDependency(dependencyId);
  }

  private void handleNewDepEdge(final TreeNode treeNode, final BigInteger dependencyId, final boolean isOut) {
    final String depEdgeLabel = DEP_PATH_EDGE_PREFIX + "_" + treeNode.getId();
    final DependencyTreeNode depNode = this.getInterfaceNode(treeNode.getParent());
    depNode.increaseCounter();

    Edge edge;
    // always attach edge to source node
    if (isOut) {
      // treeNode is source
      if (treeNode.hasEdge(depEdgeLabel)) {
        edge = treeNode.getEdge(depEdgeLabel);
        final int edgeCount = edge.getIncludingDependenciesSize() + 1;
        if (edgeCount > this.maxEdgeCounter) {
          this.maxEdgeCounter = edgeCount;
        }

        treeNode.setEdge(edge);
      } else {
        edge = new Edge(depEdgeLabel, treeNode.getId(), depNode.getId(), treeNode.getParent().getId());

        treeNode.setEdge(edge);
      }
    } else {
      // interface node is source
      if (depNode.hasEdge(depEdgeLabel)) {
        edge = depNode.getEdge(depEdgeLabel);
        depNode.setEdge(edge);
      } else {
        edge = new Edge(depEdgeLabel, depNode.getId(), treeNode.getId(), treeNode.getParent().getId());
        depNode.setEdge(edge);
      }
    }

    edge.addIncludingDependency(dependencyId);
  }

  private DependencyTreeNode getInterfaceNode(final TreeNode parent) {
    final DependencyTreeNode result;
    final String intLeafLabel = INTERFACE_PREFIX + "_" + parent.getId();

    final DependencyTreeNode treeNode = parent.findInterfaceLeafNode(intLeafLabel);

    if (treeNode == null) {
      result = this.addInterfaceLeafNode(intLeafLabel, parent);
    } else {
      result = treeNode;
    }

    return result;
  }

  private DependencyTreeNode addInterfaceLeafNode(final String intLeafLabel, final TreeNode parent) {
    final Integer id = this.getNextSequence();
    final DependencyTreeNode interfaceLeafTreeNode = new DependencyTreeNode(id, parent, parent.getDepth() + 1);
    parent.getChildren().put(intLeafLabel, interfaceLeafTreeNode);

    return interfaceLeafTreeNode;
  }

  private int getNextSequence() {
    this.generatedIdSequence = this.generatedIdSequence + 1;
    return this.generatedIdSequence;
  }
}
