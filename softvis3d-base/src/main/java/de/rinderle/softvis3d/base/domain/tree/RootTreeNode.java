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
package de.rinderle.softvis3d.base.domain.tree;

import java.util.HashMap;
import java.util.Map;

public class RootTreeNode extends TreeNode {

  private final Map<Integer, Dependency> sourceDependencies = new HashMap<>();

  public RootTreeNode(final String id) {
    super(id, null, 0, TreeNodeType.TREE, "root");
  }

  public Map<Integer, Dependency> getSourceDependencies() {
    return sourceDependencies;
  }

  public void addDependency(final Dependency treeDependency) {
    sourceDependencies.put(treeDependency.getId().intValue(),
      treeDependency);
  }
}
