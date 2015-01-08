/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.cache;

import de.rinderle.softvis3d.domain.SnapshotStorageKey;
import de.rinderle.softvis3d.domain.SnapshotTreeResult;

public interface SnapshotCacheService {

	void printCacheContents();

	boolean containsKey(SnapshotStorageKey key);

	SnapshotTreeResult getSnapshotTreeResult(SnapshotStorageKey key);

	void save(SnapshotTreeResult result);

}
