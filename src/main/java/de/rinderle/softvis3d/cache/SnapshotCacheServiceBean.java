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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SnapshotCacheServiceBean implements SnapshotCacheService {

	private static final Logger LOGGER = LoggerFactory
			.getLogger(SnapshotCacheServiceBean.class);

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
		SnapshotTreeStorage.save(result);
	}

	@Override
	public SnapshotTreeResult getSnapshotTreeResult(SnapshotStorageKey key) {
		return SnapshotTreeStorage.get(key);
	}

}
