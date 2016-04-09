/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2015 Stefan Rinderle
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

import att.grappa.Graph;
import de.rinderle.softvis3d.base.domain.LayoutViewType;
import de.rinderle.softvis3d.base.domain.graph.ResultPlatform;
import de.rinderle.softvis3d.domain.SnapshotStorageKey;
import de.rinderle.softvis3d.domain.VisualizationRequest;
import de.rinderle.softvis3d.domain.sonar.ScmInfoType;
import java.util.HashMap;
import java.util.Map;
import org.junit.Test;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

public class LayoutCacheServiceTest {

  private final LayoutCacheService underTest = new LayoutCacheService();

  @Test
  public void test() throws Exception {
    final int lastEntryKeyNumber = 100;

    for (int i = 0; i < lastEntryKeyNumber + 1; i++) {
      final SnapshotStorageKey key = getSnapshotStorageKey(i);
      final Map<Integer, ResultPlatform> value = new HashMap<Integer, ResultPlatform>();
      value.put(i, new ResultPlatform(new Graph("" + i)));
      underTest.save(key, value);
    }

    underTest.printCacheContents();
    // check limits
    assertFalse(underTest.containsKey(getSnapshotStorageKey(0)));
    assertTrue(underTest.containsKey(getSnapshotStorageKey(lastEntryKeyNumber)));

    assertNull(underTest.getLayoutResult(getSnapshotStorageKey(0)));

    final Map<Integer, ResultPlatform> cachedValue = underTest.getLayoutResult(getSnapshotStorageKey(lastEntryKeyNumber));
    assertTrue(cachedValue.containsKey(lastEntryKeyNumber));
  }

  private SnapshotStorageKey getSnapshotStorageKey(final int id) {
    final VisualizationRequest requestDto = new VisualizationRequest(id, LayoutViewType.CITY, 1, 1, ScmInfoType.NONE);
    return new SnapshotStorageKey(requestDto);
  }
}
