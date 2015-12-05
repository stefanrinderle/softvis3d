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
package de.rinderle.softvis3d;

import de.rinderle.softvis3d.domain.LayoutViewType;
import de.rinderle.softvis3d.domain.SnapshotStorageKey;
import de.rinderle.softvis3d.domain.SnapshotTreeResult;
import de.rinderle.softvis3d.domain.VisualizationRequest;
import de.rinderle.softvis3d.domain.graph.ResultPlatform;
import de.rinderle.softvis3d.domain.tree.RootTreeNode;
import de.rinderle.softvis3d.layout.LayoutProcessor;
import de.rinderle.softvis3d.postprocessing.PostProcessor;
import java.util.HashMap;
import java.util.Map;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.when;

/**
 * Created by stefan on 12.07.15.
 */
public class VisualizationProcessorTest {

  @Mock
  private LayoutProcessor layoutProcessor;

  @Mock
  private PostProcessor calc;

  @InjectMocks
  private VisualizationProcessor underTest;

  @Before
  public void setUp() {
    MockitoAnnotations.initMocks(this);
  }

  @Test
  public void testVisualize() throws Exception {
    final VisualizationSettings settings = new VisualizationSettings();

    final VisualizationRequest requestDTO = new VisualizationRequest(1, LayoutViewType.CITY, 1, 20);
    final SnapshotStorageKey key = new SnapshotStorageKey(requestDTO);
    final RootTreeNode tree = new RootTreeNode(1);
    final SnapshotTreeResult snapShotTreeResult = new SnapshotTreeResult(key, tree);
    final Map<Integer, ResultPlatform> resultGraphs = new HashMap<>();

    when(layoutProcessor.process(eq(settings), eq(requestDTO), eq(snapShotTreeResult), any(VisualizationAdditionalInfos.class))).thenReturn(resultGraphs);

    final Map<Integer, ResultPlatform> result = underTest.visualize(tree.getId(), settings, requestDTO, snapShotTreeResult, null);

    assertEquals(resultGraphs, result);
  }
}
