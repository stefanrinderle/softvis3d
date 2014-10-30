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
    normalizeNode(root);
  }

  private void normalizeNode(final TreeNode node) {
    TreeMap<String, TreeNode> children = (TreeMap<String, TreeNode>) node.getChildren();
    TreeMap<String, TreeNode> copyOfChildren = (TreeMap<String, TreeNode>) children.clone();

    if (children.size() == 1) {
      removeNodeFromStructure(node);
    }

    for (TreeNode child : copyOfChildren.values()) {
      normalizeNode(child);
    }
  }

  private void removeNodeFromStructure(TreeNode node) {
    if (node.getParent() != null) {
      // set new parent for child
      TreeMap<String, TreeNode> children = (TreeMap<String, TreeNode>) node.getChildren();
      TreeNode child = (TreeNode) children.values().toArray()[0];

      child.setParent(node.getParent());

      // update name
      child.setName(node.getName() + "/" + child.getName());

      // update children of parent
      // check for root node
      Map<String, TreeNode> parentChildren = node.getParent().getChildren();
      parentChildren.remove(node.getName());
      parentChildren.put(child.getName(), child);
    }
  }

  public void recalculateDepth(final TreeNode root) {
    recalculateDepth(0, root);
  }

  private void recalculateDepth(int depth, TreeNode node) {
    node.setDepth(depth);

    for (TreeNode child : node.getChildren().values()) {
      recalculateDepth(depth + 1, child);
    }
  }

}
