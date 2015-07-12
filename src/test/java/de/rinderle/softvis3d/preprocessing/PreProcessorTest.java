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
package de.rinderle.softvis3d.preprocessing;

import de.rinderle.softvis3d.cache.SnapshotCacheService;
import de.rinderle.softvis3d.dao.DaoService;
import de.rinderle.softvis3d.domain.LayoutViewType;
import de.rinderle.softvis3d.domain.SnapshotStorageKey;
import de.rinderle.softvis3d.domain.SnapshotTreeResult;
import de.rinderle.softvis3d.domain.VisualizationRequest;
import de.rinderle.softvis3d.preprocessing.dependencies.DependencyExpander;
import de.rinderle.softvis3d.preprocessing.tree.OptimizeTreeStructure;
import de.rinderle.softvis3d.preprocessing.tree.TreeBuilder;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.when;

/**
 * Created by stefan on 12.07.15.
 */
public class PreProcessorTest {

  @Mock
  private TreeBuilder treeBuilder;
  @Mock
  private OptimizeTreeStructure optimizeTreeStructure;
  @Mock
  private SnapshotCacheService snapshotCacheService;
  @Mock
  private DaoService daoService;
  @Mock
  private DependencyExpander dependencyExpander;

  @InjectMocks
  private PreProcessor preProcessor;

  @Before
  public void setUp() {
    MockitoAnnotations.initMocks(this);
  }

  @Test
  public void testProcessCached() throws Exception {
    VisualizationRequest requestDTO = new VisualizationRequest(1, LayoutViewType.CITY, 1, 20);
    final SnapshotStorageKey mapKey = new SnapshotStorageKey(requestDTO);

    when(snapshotCacheService.containsKey(eq(mapKey))).thenReturn(true);
    SnapshotTreeResult expectedResult = new SnapshotTreeResult(mapKey, null);
    when(snapshotCacheService.getSnapshotTreeResult(eq(mapKey))).thenReturn(expectedResult);
    expectedResult = snapshotCacheService.getSnapshotTreeResult(mapKey);

    SnapshotTreeResult result = preProcessor.process(requestDTO);

    assertEquals(expectedResult, result);
  }

  @Test
  public void testProcessNotCachedCity() throws Exception {
    VisualizationRequest requestDTO = new VisualizationRequest(1, LayoutViewType.CITY, 1, 20);
    final SnapshotStorageKey mapKey = new SnapshotStorageKey(requestDTO);

    when(snapshotCacheService.containsKey(eq(mapKey))).thenReturn(false);
    SnapshotTreeResult result = preProcessor.process(requestDTO);

    assertEquals(mapKey, result.getStorageKey());
  }

  @Test
  public void testProcessNotCachedDependency() throws Exception {
    VisualizationRequest requestDTO = new VisualizationRequest(1, LayoutViewType.DEPENDENCY, 1, 20);
    final SnapshotStorageKey mapKey = new SnapshotStorageKey(requestDTO);

    when(snapshotCacheService.containsKey(eq(mapKey))).thenReturn(false);
    SnapshotTreeResult result = preProcessor.process(requestDTO);

    assertEquals(mapKey, result.getStorageKey());
  }
}
