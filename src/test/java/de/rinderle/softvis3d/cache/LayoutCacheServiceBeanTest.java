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

import de.rinderle.softvis3d.domain.LayoutViewType;
import de.rinderle.softvis3d.domain.SnapshotStorageKey;
import de.rinderle.softvis3d.domain.VisualizationRequest;
import de.rinderle.softvis3d.domain.graph.ResultPlatform;
import junit.framework.TestCase;

import java.util.HashMap;
import java.util.Map;

public class LayoutCacheServiceBeanTest extends TestCase {

  private final LayoutCacheServiceBean underTest = new LayoutCacheServiceBean();

  public void testSave() throws Exception {
    final SnapshotStorageKey key1 = getSnapshotStorageKey(1);
    final SnapshotStorageKey key2 = getSnapshotStorageKey(2);
    final SnapshotStorageKey key3 = getSnapshotStorageKey(3);
    final SnapshotStorageKey key4 = getSnapshotStorageKey(4);
    final SnapshotStorageKey key5 = getSnapshotStorageKey(5);
    final SnapshotStorageKey key6 = getSnapshotStorageKey(6);
    final Map<Integer, ResultPlatform> result = new HashMap<Integer, ResultPlatform>();

    underTest.save(key1, result);
    underTest.save(key2, result);
    underTest.save(key3, result);
    underTest.save(key4, result);
    underTest.save(key5, result);
    underTest.save(key6, result);

    underTest.printCacheContents();

    assertNull(underTest.getLayoutResult(key1));
    assertNotNull(underTest.getLayoutResult(key2));
    assertNotNull(underTest.getLayoutResult(key3));
    assertNotNull(underTest.getLayoutResult(key4));
    assertNotNull(underTest.getLayoutResult(key5));
    assertNotNull(underTest.getLayoutResult(key6));
  }

  private SnapshotStorageKey getSnapshotStorageKey(final int id) {
    VisualizationRequest requestDto = new VisualizationRequest(id, LayoutViewType.CITY, 1, 1);
    return new SnapshotStorageKey(requestDto);
  }
}
