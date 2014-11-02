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

import de.rinderle.softviz3d.sonar.SonarDependency;
import de.rinderle.softviz3d.tree.ResourceTreeService;
import de.rinderle.softviz3d.tree.TreeNode;

import javax.inject.Inject;

import java.util.List;

public class DependencyExpanderImpl implements DependencyExpander {

  public static final String INTERFACE_PREFIX = "interface";
  private static final String DEP_PATH_EDGE_PREFIX = "depPath";

  private Integer projectId;
  private int maxEdgeCounter;

  @Inject
  private ResourceTreeService resourceTreeService;

  public int execute(final Integer projectId, final List<SonarDependency> dependencies) {
    maxEdgeCounter = 1;

    this.projectId = projectId;

    for (final SonarDependency dependency : dependencies) {

      final Integer sourceId = dependency.getFromSnapshotId();
      final Integer destinationId = dependency.getToSnapshotId();
      // search for the common ancestor
      final TreeNode source = this.resourceTreeService.findNode(LayoutViewType.DEPENDENCY, projectId, sourceId);
      final TreeNode destination = this.resourceTreeService.findNode(LayoutViewType.DEPENDENCY, projectId, destinationId);

      final DependencyType dependencyType = this.getDependencyType(source, destination);

      if (dependencyType.equals(DependencyType.INPUT_FLAT)) {
        this.handleNewFlatDepEdge(source, destination);
      } else if (dependencyType.equals(DependencyType.INPUT_TREE)) {
        this.createDependencyPath(source, destination);
      } else {
        // do nothing. That's on dependency type dir. Analyse and fix.
      }
    }

    return maxEdgeCounter;
  }

  private DependencyType getDependencyType(final TreeNode from, final TreeNode to) {
    // TODO check this - should be if a dependency to a dir was given.
    if (from != null && to != null) {
      final boolean hasSameParent = from.getParent().getId().equals(to.getParent().getId());

      if (hasSameParent) {
        return DependencyType.INPUT_FLAT;
      } else {
        return DependencyType.INPUT_TREE;
      }
    } else {
      return DependencyType.DIR;
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

      if (edgeCount > maxEdgeCounter) {
        maxEdgeCounter = edgeCount;
      }

      source.setEdge(edge);
    } else {
      final Edge edge = new Edge(this.projectId, depEdgeLabel,
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

        if (edgeCount > maxEdgeCounter) {
          maxEdgeCounter = edgeCount;
        }

        treeNode.setEdge(edge);
      } else {
        final TreeNode depNode = this.getInterfaceNode(treeNode.getParent().getId());

        final Edge element = new Edge(this.projectId, depEdgeLabel, treeNode.getId(), depNode.getId(), treeNode.getParent().getId());

        treeNode.setEdge(element);
      }
    } else {
      // interface node is source
      final TreeNode depNode = this.getInterfaceNode(treeNode.getParent().getId());
      if (depNode.hasEdge(depEdgeLabel)) {
        final Edge edge = depNode.getEdge(depEdgeLabel);
        edge.setCounter(edge.getCounter() + 1);
        depNode.setEdge(edge);
      } else {
        final Edge element = new Edge(this.projectId, depEdgeLabel, depNode.getId(), treeNode.getId(), treeNode.getParent().getId());
        depNode.setEdge(element);
      }
    }

  }

  private TreeNode getInterfaceNode(final Integer parentId) {
    final TreeNode result;
    final String intLeafLabel = INTERFACE_PREFIX + "_" + parentId;

    final TreeNode treeNode = this.resourceTreeService.findInterfaceLeafNode(LayoutViewType.DEPENDENCY, this.projectId, intLeafLabel);

    if (treeNode != null) {
      result = treeNode;
    } else {
      result = this.resourceTreeService.addInterfaceLeafNode(LayoutViewType.DEPENDENCY, this.projectId, intLeafLabel, parentId);
    }

    return result;
  }
}
