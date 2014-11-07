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

import com.google.inject.Inject;
import de.rinderle.softviz3d.domain.SnapshotStorageKey;
import de.rinderle.softviz3d.domain.tree.TreeNode;
import de.rinderle.softviz3d.domain.tree.TreeNodeType;
import de.rinderle.softviz3d.sonar.SonarService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class InterfaceNodeServiceBean implements InterfaceNodeService {

  private static final Logger LOGGER = LoggerFactory.getLogger(InterfaceNodeServiceBean.class);

  // TODO: different generated id sequence in ResourceTreeServiceImpl and PathWalker.
  private int generatedIdSequence = Integer.MAX_VALUE - 1000000;

  @Inject
  private SonarService sonarService;
  @Inject
  private SnapshotCacheService snapshotCacheService;

  @Override
  public TreeNode addInterfaceLeafNode(final SnapshotStorageKey key, final String intLeafLabel, final Integer parentId) {
    // search for parent node
    final TreeNode parent = snapshotCacheService.findNode(key, parentId);

    final Integer id = this.getNextSequence();
    final TreeNode interfaceLeafTreeNode = new TreeNode(id, parent, parent.getDepth() + 1,
      TreeNodeType.DEPENDENCY_GENERATED, "elevatorNode_" + id, 0, 0);
    parent.getChildren().put(intLeafLabel, interfaceLeafTreeNode);

    return interfaceLeafTreeNode;
  }

  private int getNextSequence() {
    this.generatedIdSequence = this.generatedIdSequence + 1;
    return this.generatedIdSequence;
  }

}
