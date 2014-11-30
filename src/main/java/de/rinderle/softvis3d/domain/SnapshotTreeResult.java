/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.domain;

import de.rinderle.softvis3d.domain.tree.TreeNode;

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
