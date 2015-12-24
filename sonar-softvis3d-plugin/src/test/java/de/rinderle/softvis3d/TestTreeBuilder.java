/*
 * SoftVis3D Sonar plugin
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

import de.rinderle.softvis3d.base.domain.tree.DependencyTreeNode;
import de.rinderle.softvis3d.base.domain.tree.TreeNode;
import de.rinderle.softvis3d.base.domain.tree.TreeNodeType;
import de.rinderle.softvis3d.base.domain.tree.ValueTreeNode;
import de.rinderle.softvis3d.domain.sonar.SonarDependency;
import de.rinderle.softvis3d.domain.sonar.SonarDependencyBuilder;
import de.rinderle.softvis3d.preprocessing.dependencies.DependencyExpander;

public class TestTreeBuilder {

  public static TreeNode createTreeNode(final int id, final TreeNode parent,
    final int depth) {
    final TreeNode result = new TreeNode(id, parent, depth,
      TreeNodeType.TREE, id + "");

    parent.addChildrenNode(id + "", result);

    return result;
  }

  public static TreeNode createValueTreeNode(final int id, final TreeNode parent,
    final int depth) {
    final ValueTreeNode result = new ValueTreeNode(id, parent, depth,
      TreeNodeType.TREE, id + "", 2.0, 2.0, 2);

    parent.addChildrenNode(id + "", result);

    return result;
  }

  public static TreeNode createInterfaceLeafNode(final int id, final TreeNode parent) {
    final TreeNode result = new DependencyTreeNode(id, parent, parent.getDepth() + 1);

    final String intLeafLabel = DependencyExpander.INTERFACE_PREFIX
      + "_" + parent.getId();

    parent.addChildrenNode(intLeafLabel, result);

    return result;
  }

  public static SonarDependency createDependency(final int from, final int to) {
    final SonarDependencyBuilder result = new SonarDependencyBuilder();

    result.withId(new Long(from + "" + to));
    result.withFromSnapshotId(from);
    result.withToSnapshotId(to);

    return result.createSonarDependency();
  }

  public static SonarDependency createDependency(final String id, final int from, final int to) {
    final SonarDependencyBuilder result = new SonarDependencyBuilder();

    result.withId(new Long(id));
    result.withFromSnapshotId(from);
    result.withToSnapshotId(to);

    return result.createSonarDependency();
  }

}
