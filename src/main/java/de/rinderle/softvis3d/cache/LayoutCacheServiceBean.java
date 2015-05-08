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

import de.rinderle.softvis3d.domain.SnapshotStorageKey;
import de.rinderle.softvis3d.domain.graph.ResultPlatform;

import java.util.LinkedList;
import java.util.Map;

public class LayoutCacheServiceBean implements LayoutCacheService {

  private static LinkedList<SnapshotStorageKey> stack = new LinkedList<SnapshotStorageKey>();

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
    if (stack.size() == 5) {
      final SnapshotStorageKey toDelete = stack.removeLast();
      LayoutResultStorage.delete(toDelete);
    }
    stack.addFirst(key);
    LayoutResultStorage.save(key, result);
  }

}
