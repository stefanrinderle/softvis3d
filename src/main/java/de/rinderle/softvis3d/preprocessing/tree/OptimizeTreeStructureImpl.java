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
package de.rinderle.softvis3d.preprocessing.tree;

import de.rinderle.softvis3d.domain.tree.TreeNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;
import java.util.TreeMap;

/**
 * Helps to optimize the created tree structure to have an visualization
 * optimized tree structure as a result.
 */
public class OptimizeTreeStructureImpl implements OptimizeTreeStructure {

  private static final Logger LOGGER = LoggerFactory
    .getLogger(OptimizeTreeStructureImpl.class);

  /**
   * An unnecessary node would be "B" in this example: A / \ B D / C
   *
   * This node would be just visualized as a platform with only one content
   * node. This reduces the "readability" of the visualisation. Therefore,
   * these nodes are removed.
   */
  @Override
  public void removeUnnecessaryNodes(final TreeNode root) {
    this.removeUnnecessaryNode(root);
    recalculateDepth(root, 0);
  }

  private void removeUnnecessaryNode(final TreeNode node) {
    final TreeMap<String, TreeNode> children = (TreeMap<String, TreeNode>) node
      .getChildren();
    final TreeMap<String, TreeNode> copyOfChildren = (TreeMap<String, TreeNode>) children
      .clone();

    if (children.size() == 1) {
      this.removeNodeFromStructure(node);
    }

    for (final TreeNode child : copyOfChildren.values()) {
      this.removeUnnecessaryNode(child);
    }
  }

  private void removeNodeFromStructure(final TreeNode node) {
    if (node.getParent() != null) {
      // set new parent for child
      final TreeMap<String, TreeNode> children = (TreeMap<String, TreeNode>) node
        .getChildren();
      final TreeNode child = (TreeNode) children.values().toArray()[0];

      child.setParent(node.getParent());

      // update name
      child.setName(node.getName() + "/" + child.getName());

      // update children of parent
      // check for root node
      final Map<String, TreeNode> parentChildren = node.getParent()
        .getChildren();
      parentChildren.remove(node.getName());
      parentChildren.put(child.getName(), child);
    }
  }

  private void recalculateDepth(final TreeNode node, final int depth) {
    node.setDepth(depth);

    for (final TreeNode child : node.getChildren().values()) {
      this.recalculateDepth(child, depth + 1);
    }
  }

}
