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
package de.rinderle.softvis3d.domain;

import de.rinderle.softvis3d.domain.sonar.ScmInfoType;
import org.junit.Ignore;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotSame;
import static org.junit.Assert.assertTrue;

/**
 * Created by stefanrinderle on 06.11.15.
 */
public class SnapshotStorageKeyTest {

  @Test
  public void testEqualsTrue() throws Exception {
    final VisualizationRequest requestDTO = new VisualizationRequest("1", "1", "20", ScmInfoType.NONE);

    final SnapshotStorageKey key1 = new SnapshotStorageKey(requestDTO);
    final SnapshotStorageKey key2 = new SnapshotStorageKey(requestDTO);

    assertTrue(key1.equals(key2));
  }

  @Test
  @Ignore
  public void testEqualsFalse() throws Exception {
    final VisualizationRequest requestDTO1 = new VisualizationRequest("1", "1", "20", ScmInfoType.NONE);
    final VisualizationRequest requestDTO2 = new VisualizationRequest("1", "1", "20", ScmInfoType.NONE);

    final SnapshotStorageKey key1 = new SnapshotStorageKey(requestDTO1);
    final SnapshotStorageKey key2 = new SnapshotStorageKey(requestDTO2);

    assertFalse(key1.equals(key2));
  }

  @Test
  public void testHashCodeTrue() throws Exception {
    final VisualizationRequest requestDTO = new VisualizationRequest("1", "1", "20", ScmInfoType.NONE);

    final SnapshotStorageKey key1 = new SnapshotStorageKey(requestDTO);
    final SnapshotStorageKey key2 = new SnapshotStorageKey(requestDTO);

    assertEquals(key1.hashCode(), key2.hashCode());
  }

  @Test
  public void testHashCodeFalse() throws Exception {
    final VisualizationRequest requestDTO1 = new VisualizationRequest("1", "1", "20", ScmInfoType.NONE);
    final VisualizationRequest requestDTO2 = new VisualizationRequest("1", "1", "20", ScmInfoType.NONE);

    final SnapshotStorageKey key1 = new SnapshotStorageKey(requestDTO1);
    final SnapshotStorageKey key2 = new SnapshotStorageKey(requestDTO2);

    assertNotSame(key1.hashCode(), key2.hashCode());
  }
}
