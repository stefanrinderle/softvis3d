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
package de.rinderle.softvis3d.preprocessing.dependencies;

import de.rinderle.softvis3d.domain.sonar.SonarDependency;
import de.rinderle.softvis3d.domain.tree.Dependency;
import de.rinderle.softvis3d.domain.tree.DependencyTreeNode;
import de.rinderle.softvis3d.domain.tree.Edge;
import de.rinderle.softvis3d.domain.tree.RootTreeNode;
import de.rinderle.softvis3d.domain.tree.TreeNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

public class DependencyExpanderBean implements DependencyExpander {

  public static final String INTERFACE_PREFIX = "interface";
  private static final Logger LOGGER = LoggerFactory.getLogger(DependencyExpanderBean.class);
  private static final String DEP_PATH_EDGE_PREFIX = "depPath";
  private int generatedIdSequence = Integer.MAX_VALUE - 1000000;

  public void execute(final RootTreeNode treeRootNode, final List<SonarDependency> dependencies) {
    for (final SonarDependency dependency : dependencies) {
      final Dependency treeDependency = processSourceDependency(treeRootNode, dependency);
      treeRootNode.addDependency(treeDependency);
    }
  }

  private Dependency processSourceDependency(RootTreeNode treeRootNode, SonarDependency sonarDependency) {
    final Integer sourceId = sonarDependency.getFromSnapshotId();
    final Integer destinationId = sonarDependency.getToSnapshotId();

    // search for the common ancestor
    final TreeNode source = treeRootNode.findNode(sourceId);
    final TreeNode destination = treeRootNode.findNode(destinationId);

    final DependencyType dependencyType = this.getDependencyType(source, destination);

    if (dependencyType.equals(DependencyType.INPUT_FLAT)) {
      this.handleNewFlatDepEdge(source, destination, sonarDependency.getId());
    } else if (dependencyType.equals(DependencyType.INPUT_TREE)) {
      this.createDependencyPath(source, destination, sonarDependency.getId());
    } else {
      LOGGER.warn("That's on dependency type dir. Analyse and fix.");
      // do nothing. That's on dependency type dir. Analyse and fix.
    }

    return new Dependency(sonarDependency.getId(), sourceId, source.getName(), destinationId, destination.getName());
  }

  private DependencyType getDependencyType(final TreeNode from, final TreeNode to) {
    // TODO check this - should be if a dependency to a dir was given.
    if (from == null || to == null) {
      LOGGER.warn("That's on dependency type dir. Analyse and fix.");
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

  private void createDependencyPath(TreeNode source, TreeNode dest, final Long dependencyId) {
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

  private void handleNewFlatDepEdge(final TreeNode source, final TreeNode dest, final Long dependencyId) {
    final String depEdgeLabel = DEP_PATH_EDGE_PREFIX + "_" + dest.getId();

    final Edge edge;
    if (source.hasEdge(depEdgeLabel)) {
      edge = source.getEdge(depEdgeLabel);
      source.setEdge(edge);
    } else {
      edge = new Edge(depEdgeLabel, source.getId(), source.getName(), dest.getId(), dest.getName());
      source.setEdge(edge);
    }

    edge.addIncludingDependency(dependencyId);
  }

  private void handleNewDepEdge(final TreeNode treeNode, final Long dependencyId, final boolean isOut) {
    final DependencyTreeNode depNode = this.getInterfaceNode(treeNode.getParent());
    depNode.increaseCounter();

    Edge edge;
    final String depEdgeLabel;
    // always attach edge to source node
    if (isOut) {
      depEdgeLabel = DEP_PATH_EDGE_PREFIX + "_" + depNode.getId();
      // treeNode is source
      if (treeNode.hasEdge(depEdgeLabel)) {
        edge = treeNode.getEdge(depEdgeLabel);
        treeNode.setEdge(edge);
      } else {
        edge = new Edge(depEdgeLabel, treeNode.getId(), treeNode.getName(), depNode.getId(), depNode.getName());

        treeNode.setEdge(edge);
      }
    } else {
      depEdgeLabel = DEP_PATH_EDGE_PREFIX + "_" + treeNode.getId();
      // interface node is source
      if (depNode.hasEdge(depEdgeLabel)) {
        edge = depNode.getEdge(depEdgeLabel);
        depNode.setEdge(edge);
      } else {
        edge = new Edge(depEdgeLabel, depNode.getId(), depNode.getName(), treeNode.getId(), treeNode.getName());
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
