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

import de.rinderle.softviz3d.layout.calc.DependencyType;
import de.rinderle.softviz3d.layout.calc.LayoutViewType;

import java.util.List;

public interface ResourceTreeService {

    TreeNode createTreeStructure(LayoutViewType type, int rootSnapshotId, int heightMetric, int footprintMetric);

    List<TreeNode> getChildrenNodeIds(LayoutViewType type, Integer rootSnapshotId, Integer id);

    List<TreeNode> getChildrenLeafIds(LayoutViewType type, Integer rootSnapshotId, Integer id);

    TreeNode findNode(LayoutViewType type, Integer rootSnapshotId, Integer id);

    Integer addInterfaceLeafNode(LayoutViewType type, Integer snapshotId, String intLeafLabel, Integer parentId);

    TreeNode findInterfaceLeafNode(LayoutViewType type, Integer snapshotId, String intLeafLabel);

    DependencyType getDependencyType(LayoutViewType type, Integer rootSnapshotId, Integer fromSnapshotId, Integer toSnapshotId);

}