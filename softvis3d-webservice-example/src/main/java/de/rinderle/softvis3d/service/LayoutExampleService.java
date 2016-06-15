/**
 * softvis3d-webservice-example
 * Copyright (C) 2016 Stefan Rinderle
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
package de.rinderle.softvis3d.service;

import de.rinderle.softvis3d.base.domain.SnapshotTreeResult;
import de.rinderle.softvis3d.base.domain.tree.RootTreeNode;
import de.rinderle.softvis3d.base.domain.tree.TreeNode;
import de.rinderle.softvis3d.base.domain.tree.TreeNodeType;
import de.rinderle.softvis3d.base.domain.tree.ValueTreeNode;

public class LayoutExampleService {

  public SnapshotTreeResult getExampleResult() throws Exception {
    return createExampleSnapshotTreeResult("1");
  }

  private SnapshotTreeResult createExampleSnapshotTreeResult(final String rootId) {
    final RootTreeNode result = new RootTreeNode(rootId);

    final TreeNode node2 = new ValueTreeNode("2", result, 1, TreeNodeType.TREE, "2", 1.3, 1.5, 2);
    final TreeNode node3 = new ValueTreeNode("3", result, 1, TreeNodeType.TREE, "3", 1.7, 1.8, 1);
    result.addChildrenNode("2", node2);
    result.addChildrenNode("3", node3);

    return new SnapshotTreeResult(result);
  }

}
