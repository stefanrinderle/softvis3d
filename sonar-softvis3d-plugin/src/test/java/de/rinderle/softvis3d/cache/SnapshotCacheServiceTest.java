/**
 * SoftVis3D Sonar plugin
 * Copyright (C) 2016 Stefan Rinderle and Yvo Niedrich
 * stefan@rinderle.info / yvo.niedrich@gmail.com
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

import de.rinderle.softvis3d.base.domain.tree.RootTreeNode;
import de.rinderle.softvis3d.domain.SnapshotStorageKey;
import de.rinderle.softvis3d.domain.VisualizationRequest;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

public class SnapshotCacheServiceTest {

  private final SnapshotCacheService underTest = new SnapshotCacheService();

  @Test
  public void test() throws Exception {
    final int lastEntryKey = 100;

    for (int i = 0; i < lastEntryKey + 1; i++) {
      final SnapshotStorageKey key = getSnapshotStorageKey(String.valueOf(i));
      final RootTreeNode value = new RootTreeNode(String.valueOf(i));
      underTest.save(key, value);
    }

    underTest.printCacheContents();
    // check limits
    assertFalse(underTest.containsKey(getSnapshotStorageKey("0")));
    assertTrue(underTest.containsKey(getSnapshotStorageKey(String.valueOf(lastEntryKey))));

    assertNull(underTest.getSnapshotTreeResult(getSnapshotStorageKey("0")));

    final RootTreeNode cachedValue = underTest.getSnapshotTreeResult(getSnapshotStorageKey(String.valueOf(lastEntryKey)));
    assertEquals(String.valueOf(lastEntryKey), cachedValue.getId());
  }

  private SnapshotStorageKey getSnapshotStorageKey(final String id) {
    final String[] metrics = {"other", "complediy"};
    final VisualizationRequest requestDto = new VisualizationRequest(id, metrics);
    return new SnapshotStorageKey(requestDto);
  }
}
