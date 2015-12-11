/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
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
package de.rinderle.softvis3d.cache;

import java.util.LinkedHashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Cache<K, V> {

  static final long MAX_SIZE = 5;
  private static final Logger LOGGER = LoggerFactory.getLogger(Cache.class);
  private final LinkedHashMap<K, V> map;

  public Cache() {
    map = new LinkedHashMap<>();
  }

  public boolean containsKey(final K key) {
    return map.containsKey(key);
  }

  public V get(final K key) {
    return map.get(key);
  }

  public int size() {
    return map.size();
  }

  public void put(final K key, final V value) {
    map.put(key, value);
    removeOldestCacheEntryIfNecessary();
  }

  void logKeys() {
    LOGGER.info("Current Cache size " + map.size());
    for (final Map.Entry<K, V> entry : map.entrySet()) {
      LOGGER.info(entry.getKey().toString());
    }
    LOGGER.info("---");
  }

  private void removeOldestCacheEntryIfNecessary() {
    if (map.size() > MAX_SIZE) {
      final K keyToDelete = map.keySet().iterator().next();
      map.remove(keyToDelete);
    }
  }

}
