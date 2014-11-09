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

import de.rinderle.softviz3d.domain.SnapshotStorageKey;
import de.rinderle.softviz3d.domain.SnapshotTreeResult;
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
