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

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

class SnapshotTreeStorage {

  private static final Logger LOGGER = LoggerFactory.getLogger(SnapshotTreeStorage.class);

  /**
   * Instead of annotating this class as singleton within the dependency injection, the
   * calculated trees have to be static. Because there are two different DI containers.
   * One for the Page extension of sonar and one for the webservice extention.
   * This will prevent the calculation of the same tree structure once for
   * the page and once for the webservice.
   */
  private static Map<String, SnapshotTreeResult> storage = new ConcurrentHashMap<String, SnapshotTreeResult>();

  static SnapshotTreeResult get(final SnapshotStorageKey key) {
    return storage.get(key.getString());
  }

  static void print() {
    LOGGER.info("Current SnapshotTreeStorage size " + storage.size());
    for (final Map.Entry<String, SnapshotTreeResult> entry : storage.entrySet()) {
      LOGGER.info(entry.getKey());
    }
    LOGGER.info("---");
  }

  static boolean containsKey(SnapshotStorageKey key) {
    return storage.containsKey(key.getString());
  }

  public static void save(SnapshotTreeResult result) {
    storage.put(result.getStorageKey().getString(), result);
  }
}
