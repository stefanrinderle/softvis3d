/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.domain;

import de.rinderle.softvis3d.domain.tree.RootTreeNode;

public class SnapshotTreeResult {

	private final SnapshotStorageKey snapshotStorageKey;
	private final RootTreeNode tree;

	public SnapshotTreeResult(final SnapshotStorageKey snapshotStorageKey,
			final RootTreeNode tree) {
		this.snapshotStorageKey = snapshotStorageKey;
		this.tree = tree;
	}

	public SnapshotStorageKey getStorageKey() {
		return this.snapshotStorageKey;
	}

	public RootTreeNode getTree() {
		return this.tree;
	}
}
