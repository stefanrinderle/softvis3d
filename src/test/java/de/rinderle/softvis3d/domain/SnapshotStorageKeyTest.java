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
package de.rinderle.softvis3d.domain;

import junit.framework.TestCase;

/**
 * Created by stefanrinderle on 06.11.15.
 */
public class SnapshotStorageKeyTest extends TestCase {

    public void testEqualsTrue() throws Exception {
        final VisualizationRequest requestDTO = new VisualizationRequest(1, LayoutViewType.CITY, 1, 20, ScmInfoType.AUTHOR_COUNT);

        final SnapshotStorageKey key1 = new SnapshotStorageKey(requestDTO);
        final SnapshotStorageKey key2 = new SnapshotStorageKey(requestDTO);

        assertTrue(key1.equals(key2));
    }

    public void testEqualsFalse() throws Exception {
        final VisualizationRequest requestDTO1 = new VisualizationRequest(1, LayoutViewType.CITY, 1, 20, ScmInfoType.AUTHOR_COUNT);
        final VisualizationRequest requestDTO2 = new VisualizationRequest(1, LayoutViewType.DEPENDENCY, 1, 20, ScmInfoType.AUTHOR_COUNT);

        final SnapshotStorageKey key1 = new SnapshotStorageKey(requestDTO1);
        final SnapshotStorageKey key2 = new SnapshotStorageKey(requestDTO2);

        assertFalse(key1.equals(key2));
    }

    public void testHashCodeTrue() throws Exception {
        final VisualizationRequest requestDTO = new VisualizationRequest(1, LayoutViewType.CITY, 1, 20, ScmInfoType.AUTHOR_COUNT);

        final SnapshotStorageKey key1 = new SnapshotStorageKey(requestDTO);
        final SnapshotStorageKey key2 = new SnapshotStorageKey(requestDTO);

        assertEquals(key1.hashCode(), key2.hashCode());
    }

    public void testHashCodeFalse() throws Exception {
        final VisualizationRequest requestDTO1 = new VisualizationRequest(1, LayoutViewType.CITY, 1, 20, ScmInfoType.AUTHOR_COUNT);
        final VisualizationRequest requestDTO2 = new VisualizationRequest(1, LayoutViewType.DEPENDENCY, 1, 20, ScmInfoType.AUTHOR_COUNT);

        final SnapshotStorageKey key1 = new SnapshotStorageKey(requestDTO1);
        final SnapshotStorageKey key2 = new SnapshotStorageKey(requestDTO2);

        assertNotSame(key1.hashCode(), key2.hashCode());
    }
}