/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.cache;

import de.rinderle.softvis3d.domain.SnapshotStorageKey;
import de.rinderle.softvis3d.domain.SnapshotTreeResult;

import java.util.LinkedList;

public class SnapshotCacheServiceBean implements SnapshotCacheService {

	private static LinkedList<SnapshotStorageKey> stack = new LinkedList<SnapshotStorageKey>();

	@Override
	public void printCacheContents() {
		SnapshotTreeStorage.print();
	}

	@Override
	public boolean containsKey(SnapshotStorageKey key) {
		return SnapshotTreeStorage.containsKey(key);
	}

	@Override
	public void save(SnapshotTreeResult result) {
		if (stack.size() == 5) {
			final SnapshotStorageKey toDelete = stack.removeLast();
			SnapshotTreeStorage.delete(toDelete);
		}
		stack.addFirst(result.getStorageKey());
		SnapshotTreeStorage.save(result);
	}

	@Override
	public SnapshotTreeResult getSnapshotTreeResult(SnapshotStorageKey key) {
		return SnapshotTreeStorage.get(key);
	}

}
