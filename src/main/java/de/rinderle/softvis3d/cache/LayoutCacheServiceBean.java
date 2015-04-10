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
import de.rinderle.softvis3d.domain.graph.ResultPlatform;

import java.util.Map;

public class LayoutCacheServiceBean implements LayoutCacheService {

    @Override
    public void printCacheContents() {
        LayoutResultStorage.print();
    }

    @Override
    public boolean containsKey(SnapshotStorageKey key) {
        return LayoutResultStorage.containsKey(key);
    }

    @Override
    public Map<Integer, ResultPlatform> getLayoutResult(SnapshotStorageKey key) {
        return LayoutResultStorage.get(key);
    }

    @Override
    public void save(SnapshotStorageKey key, Map<Integer, ResultPlatform> result) {
        LayoutResultStorage.save(key, result);
    }

}
