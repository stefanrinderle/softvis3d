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

import java.util.ArrayList;
import java.util.Map;

public interface LayoutCacheService {

    void printCacheContents();

    boolean containsKey(SnapshotStorageKey key);

    Map<Integer, ResultPlatform> getLayoutResult(SnapshotStorageKey key);

    void save(SnapshotStorageKey key, Map<Integer, ResultPlatform> result);

}
