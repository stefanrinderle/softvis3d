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
package de.rinderle.softviz3d.preprocessing;

import de.rinderle.softviz3d.domain.SnapshotStorageKey;
import de.rinderle.softviz3d.domain.tree.TreeNode;

public class SnapshotTreeResult {

  private final SnapshotStorageKey snapshotStorageKey;
  private final TreeNode tree;
  private final int maxEdgeCounter;

  public SnapshotTreeResult(final SnapshotStorageKey snapshotStorageKey, final TreeNode tree, final int maxEdgeCounter) {
    validateMaxEdgeCounter(maxEdgeCounter);

    this.snapshotStorageKey = snapshotStorageKey;
    this.tree = tree;
    this.maxEdgeCounter = maxEdgeCounter;
  }

  private void validateMaxEdgeCounter(int maxEdgeCounter) {
    if (maxEdgeCounter < 0) {
      throw new IllegalArgumentException("maxEdgeCounter should not be < 0: " + maxEdgeCounter);
    }
  }

  public SnapshotStorageKey getStorageKey() {
    return this.snapshotStorageKey;
  }

  public int getMaxEdgeCounter() {
    return this.maxEdgeCounter;
  }

  public TreeNode getTree() {
    return this.tree;
  }
}
