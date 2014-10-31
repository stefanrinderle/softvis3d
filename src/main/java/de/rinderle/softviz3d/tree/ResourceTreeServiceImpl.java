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
package de.rinderle.softviz3d.tree;

import com.google.inject.Inject;
import com.google.inject.Singleton;
import de.rinderle.softviz3d.layout.calc.LayoutViewType;
import de.rinderle.softviz3d.sonar.SonarDao;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Singleton
public class ResourceTreeServiceImpl implements ResourceTreeService {
  private static final Logger LOGGER = LoggerFactory.getLogger(ResourceTreeServiceImpl.class);

  private Map<String, PathWalker> loadedPathWalkers = new ConcurrentHashMap<String, PathWalker>();

  @Inject
  private SonarDao sonarDao;

  @Override
  public TreeNode createTreeStructure(final LayoutViewType type, final int rootSnapshotId, final int heightMetric, final int footprintMetric) {
    LOGGER.info("loadedPathWalkers size " + this.loadedPathWalkers.size());

    if (!this.loadedPathWalkers.containsKey(this.getId(type, rootSnapshotId))) {
      LOGGER.info("Created tree structure for id " + rootSnapshotId);
      final PathWalker pathWalker = new PathWalker(rootSnapshotId);

      final List<Object[]> flatChildren = this.sonarDao.getAllProjectElements(rootSnapshotId, heightMetric, footprintMetric);

      // s.id, p.name, m1.value, m2.value
      for (final Object[] flatChild : flatChildren) {
        final int snapshotId = (Integer) flatChild[0];
        final String name = (String) flatChild[1];
        final BigDecimal footprintMetricValue = (BigDecimal) flatChild[2];
        final BigDecimal heightMetricValue = (BigDecimal) flatChild[3];

        pathWalker.addPath(snapshotId, name, footprintMetricValue.doubleValue(), heightMetricValue.doubleValue());
      }

      final TreeNormalizer normalizer = new TreeNormalizer();
      normalizer.normalizeTree(pathWalker.getTree());
      normalizer.recalculateDepth(pathWalker.getTree());

      this.loadedPathWalkers.put(this.getId(type, rootSnapshotId), pathWalker);
    }

    return this.loadedPathWalkers.get(this.getId(type, rootSnapshotId)).getTree();
  }

  private String getId(final LayoutViewType type, final int rootSnapshotId) {
    return rootSnapshotId + "_" + type.name();
  }

  @Override
  public List<TreeNode> getChildrenNodeIds(final LayoutViewType type, final Integer rootSnapshotId, final Integer id) {
    final PathWalker pathWalker = this.loadedPathWalkers.get(this.getId(type, rootSnapshotId));

    final TreeNode treeNode = this.recursiveSearch(id, pathWalker.getTree());

    return this.getChildrenNodes(treeNode.getChildren());
  }

  @Override
  public List<TreeNode> getChildrenLeafIds(final LayoutViewType type, final Integer rootSnapshotId, final Integer id) {
    final PathWalker pathWalker = this.loadedPathWalkers.get(this.getId(type, rootSnapshotId));

    final TreeNode treeNode = this.recursiveSearch(id, pathWalker.getTree());

    return this.getChildrenLeaves(treeNode.getChildren());
  }

  @Override
  public TreeNode findNode(final LayoutViewType type, final Integer rootSnapshotId, final Integer id) {
    final PathWalker pathWalker = this.loadedPathWalkers.get(this.getId(type, rootSnapshotId));

    return this.recursiveSearch(id, pathWalker.getTree());
  }

  @Override
  public TreeNode addInterfaceLeafNode(final LayoutViewType type, final Integer rootSnapshotId, final String intLeafLabel, final Integer parentId) {
    final PathWalker pathWalker = this.loadedPathWalkers.get(this.getId(type, rootSnapshotId));

    // search for parent node
    final TreeNode parent = this.recursiveSearch(parentId, pathWalker.getTree());

    final Integer id = pathWalker.getNextSequence();
    final TreeNode interfaceLeafTreeNode = new TreeNode(id, parent, parent.getDepth() + 1, TreeNodeType.DEPENDENCY_GENERATED, "elevatorNode_" + id, 0, 0);
    parent.getChildren().put(intLeafLabel, interfaceLeafTreeNode);

    return interfaceLeafTreeNode;
  }

  @Override
  public TreeNode findInterfaceLeafNode(final LayoutViewType type, final Integer rootSnapshotId, final String intLeafLabel) {
    final PathWalker pathWalker = this.loadedPathWalkers.get(this.getId(type, rootSnapshotId));
    return this.recursiveSearch(intLeafLabel, pathWalker.getTree());
  }

  private TreeNode recursiveSearch(final String name, final TreeNode treeNode) {
    final Map<String, TreeNode> children = treeNode.getChildren();
    TreeNode temp;

    if (children.containsKey(name)) {
      return children.get(name);
    } else if (!children.isEmpty()) {
      for (final TreeNode child : children.values()) {
        temp = this.recursiveSearch(name, child);
        if (temp != null) {
          return temp;
        }
      }
    }

    return null;
  }

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

  private List<TreeNode> getChildrenNodes(final Map<String, TreeNode> children) {
    final List<TreeNode> result = new ArrayList<TreeNode>();

    for (final TreeNode child : children.values()) {
      if (!child.getChildren().isEmpty()) {
        result.add(child);
      }
    }

    return result;
  }

  private List<TreeNode> getChildrenLeaves(final Map<String, TreeNode> children) {
    final List<TreeNode> result = new ArrayList<TreeNode>();

    for (final TreeNode child : children.values()) {
      if (child.getChildren().isEmpty()) {
        result.add(child);
      }
    }

    return result;
  }

}
