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
package de.rinderle.softvis3d.preprocessing;

import de.rinderle.softvis3d.base.domain.SnapshotTreeResult;
import de.rinderle.softvis3d.cache.SnapshotCacheService;
import de.rinderle.softvis3d.dao.DaoService;
import de.rinderle.softvis3d.domain.SnapshotStorageKey;
import de.rinderle.softvis3d.domain.VisualizationRequest;
import de.rinderle.softvis3d.domain.sonar.ColorMetricType;
import de.rinderle.softvis3d.preprocessing.tree.OptimizeTreeStructure;
import de.rinderle.softvis3d.preprocessing.tree.TreeBuilder;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.sonar.api.server.ws.LocalConnector;

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

  @InjectMocks
  private PreProcessor preProcessor;

  @Before
  public void setUp() {
    MockitoAnnotations.initMocks(this);
  }

  @Test
  public void testProcessCached() throws Exception {
    final VisualizationRequest requestDTO = new VisualizationRequest("1", "1", "20", ColorMetricType.NONE);
    final SnapshotStorageKey mapKey = new SnapshotStorageKey(requestDTO);

    when(snapshotCacheService.containsKey(eq(mapKey))).thenReturn(true);
    SnapshotTreeResult expectedResult = new SnapshotTreeResult(null);
    when(snapshotCacheService.getSnapshotTreeResult(eq(mapKey))).thenReturn(expectedResult);
    expectedResult = snapshotCacheService.getSnapshotTreeResult(mapKey);

    LocalConnector localConnector = null;
    final SnapshotTreeResult result = preProcessor.process(localConnector, requestDTO);

    assertEquals(expectedResult, result);
  }

}
