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

import java.util.Map;
import java.util.TreeMap;

public class TreeNormalizer {

  public void normalizeTree(final TreeNode root) {
    this.normalizeNode(root);
  }

  private void normalizeNode(final TreeNode node) {
    final TreeMap<String, TreeNode> children = (TreeMap<String, TreeNode>) node.getChildren();
    final TreeMap<String, TreeNode> copyOfChildren = (TreeMap<String, TreeNode>) children.clone();

    if (children.size() == 1) {
      this.removeNodeFromStructure(node);
    }

    for (final TreeNode child : copyOfChildren.values()) {
      this.normalizeNode(child);
    }
  }

  private void removeNodeFromStructure(final TreeNode node) {
    if (node.getParent() != null) {
      // set new parent for child
      final TreeMap<String, TreeNode> children = (TreeMap<String, TreeNode>) node.getChildren();
      final TreeNode child = (TreeNode) children.values().toArray()[0];

      child.setParent(node.getParent());

      // update name
      child.setName(node.getName() + "/" + child.getName());

      // update children of parent
      // check for root node
      final Map<String, TreeNode> parentChildren = node.getParent().getChildren();
      parentChildren.remove(node.getName());
      parentChildren.put(child.getName(), child);
    }
  }

  public void recalculateDepth(final TreeNode root) {
    this.recalculateDepth(0, root);
  }

  private void recalculateDepth(final int depth, final TreeNode node) {
    node.setDepth(depth);

    for (final TreeNode child : node.getChildren().values()) {
      this.recalculateDepth(depth + 1, child);
    }
  }

}
