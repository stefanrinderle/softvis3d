/*
 * softvis3d-base
 * Copyright (C) 2015 Stefan Rinderle
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
package de.rinderle.softvis3d;

import de.rinderle.softvis3d.domain.tree.TreeNode;
import de.rinderle.softvis3d.domain.tree.TreeNodeType;
import de.rinderle.softvis3d.domain.tree.ValueTreeNode;

import java.util.HashMap;
import java.util.Map;

public class TestTreeBuilder {

  public static TreeNode createValueTreeNode(final String id, final String key, final TreeNode parent, final int
    depth) {
    final Map<String, Double> metrics = new HashMap<>();
    metrics.put("ncloc", 12.32);
    metrics.put("complexity", 1.0);
    final ValueTreeNode result = new ValueTreeNode(id, key, parent, depth,
        TreeNodeType.TREE, id, metrics);

    parent.addChildrenNode(id, result);

    return result;
  }

}
