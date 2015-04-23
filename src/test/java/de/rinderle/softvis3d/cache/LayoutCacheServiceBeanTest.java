/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
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