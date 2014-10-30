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

//  private Map<Integer, Integer> nodesCounter = new HashMap<Integer, Integer>();

  private Integer projectId;

  @Inject
  private ResourceTreeService resourceTreeService;

  public void execute(final Integer projectId, final List<SonarDependency> dependencies) {
    this.projectId = projectId;

    for (SonarDependency dependency : dependencies) {

      DependencyType dependencyType =
        resourceTreeService.getDependencyType(LayoutViewType.DEPENDENCY, projectId, dependency.getFromSnapshotId(), dependency.getToSnapshotId());
      if (dependencyType.equals(DependencyType.INPUT_FLAT)) {
//        incrementNodesCounter(dependency.getToSnapshotId());
//        incrementNodesCounter(dependency.getFromSnapshotId());
      } else {
        Integer out = dependency.getToSnapshotId();
        Integer in = dependency.getFromSnapshotId();
        // search for the common ancestor
        createDependencyPath(resourceTreeService.findNode(LayoutViewType.DEPENDENCY, projectId, out), resourceTreeService.findNode(LayoutViewType.DEPENDENCY, projectId, in));
      }
    }
  }

//  private void incrementNodesCounter(final Integer nodeId) {
//    if (nodesCounter.containsKey(nodeId)) {
//      nodesCounter.put(nodeId, nodesCounter.get(nodeId) + 1);
//    } else {
//      nodesCounter.put(nodeId, 1);
//    }
//  }

  private void createDependencyPath(TreeNode source, TreeNode dest) {
    while (!source.getParent().getId().equals(dest.getParent().getId())) {
      if (source.getDepth() > dest.getDepth()) {
        handleNewDepEdge(source, false);
        source = source.getParent();
      } else {
        handleNewDepEdge(dest, true);
        dest = dest.getParent();
      }
    }

    // compute till both have the same parent
    while (!source.getParent().getId().equals(dest.getParent().getId())) {
      if (source.getDepth() > dest.getDepth()) {
        handleNewDepEdge(source, false);
        source = source.getParent();
      } else {
        handleNewDepEdge(dest, true);
        dest = dest.getParent();
      }
    }

    handleNewFlatDepEdge(dest, source);
  }

  private void handleNewFlatDepEdge(TreeNode source, TreeNode dest) {
    String depEdgeLabel = DEP_PATH_EDGE_PREFIX + "_" + source.getId();

    if (source.hasEdge(depEdgeLabel)) {
      Edge edge = source.getEdge(depEdgeLabel);
      edge.setCounter(edge.getCounter() + 1);
      source.setEdge(edge);
    } else {
      Edge edge = new Edge(projectId, depEdgeLabel,
        source.getId(), dest.getId(), source.getParent().getId());
      source.setEdge(edge);
    }
  }

  private void handleNewDepEdge(TreeNode treeNode, boolean isOut) {
    String depEdgeLabel = DEP_PATH_EDGE_PREFIX + "_" + treeNode.getId();
    // always attach edge to source node
    if (isOut) {
        // treeNode is source
        if (treeNode.hasEdge(depEdgeLabel)) {
            Edge edge = treeNode.getEdge(depEdgeLabel);
            edge.setCounter(edge.getCounter() + 1);
            treeNode.setEdge(edge);
        } else {
            TreeNode depNode = getInterfaceNode(treeNode.getParent().getId());

            final Edge element = new Edge(projectId, depEdgeLabel, treeNode.getId(), depNode.getId(), treeNode.getParent().getId());

            treeNode.setEdge(element);
        }
    } else {
        // interface node is source
        TreeNode depNode = getInterfaceNode(treeNode.getParent().getId());
        if (depNode.hasEdge(depEdgeLabel)) {
            Edge edge = depNode.getEdge(depEdgeLabel);
            edge.setCounter(edge.getCounter() + 1);
            depNode.setEdge(edge);
        } else {
            final Edge element = new Edge(projectId, depEdgeLabel, depNode.getId(), treeNode.getId(), treeNode.getParent().getId());
            depNode.setEdge(element);
        }
    }

  }

  private TreeNode getInterfaceNode(Integer parentId) {
      TreeNode result;
    String intLeafLabel = INTERFACE_PREFIX + "_" + parentId;

    TreeNode treeNode = resourceTreeService.findInterfaceLeafNode(LayoutViewType.DEPENDENCY, projectId, intLeafLabel);

    if (treeNode != null) {
      result = treeNode;
    } else {
      result = resourceTreeService.addInterfaceLeafNode(LayoutViewType.DEPENDENCY, projectId, intLeafLabel, parentId);
    }

    return result;
  }
}
