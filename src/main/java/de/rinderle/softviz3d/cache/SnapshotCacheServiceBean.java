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
package de.rinderle.softviz3d.cache;

import de.rinderle.softviz3d.domain.SnapshotStorageKey;
import de.rinderle.softviz3d.domain.tree.TreeNode;
import de.rinderle.softviz3d.preprocessing.SnapshotTreeResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class SnapshotCacheServiceBean implements SnapshotCacheService {

  private static final Logger LOGGER = LoggerFactory.getLogger(SnapshotCacheServiceBean.class);

  @Override
  public void printCacheContents() {
    SnapshotTreeStorage.print();
  }

  @Override
  public boolean containsKey(SnapshotStorageKey key) {
    return SnapshotTreeStorage.containsKey(key);
  }

  @Override
  public void save(SnapshotTreeResult result) {
    SnapshotTreeStorage.save(result);
  }

  @Override
  public List<TreeNode> getChildrenNodeIds(final SnapshotStorageKey key, final Integer id) {
    final TreeNode treeNode = this.findNode(key, id);

    return this.getChildrenNodes(treeNode.getChildren());
  }

  @Override
  public List<TreeNode> getChildrenLeafIds(final SnapshotStorageKey key, final Integer id) {
    final TreeNode treeNode = this.findNode(key, id);

    return this.getChildrenLeaves(treeNode.getChildren());
  }

  @Override
  public TreeNode findNode(final SnapshotStorageKey key, final Integer id) {
    final TreeNode rootNode = getTreeStructure(key);

    return this.recursiveSearch(id, rootNode);
  }

  @Override
  public TreeNode getTreeStructure(SnapshotStorageKey key) {
    return SnapshotTreeStorage.get(key).getTree();
  }

  @Override
  public SnapshotTreeResult getSnapshotTreeResult(SnapshotStorageKey key) {
    return SnapshotTreeStorage.get(key);
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
