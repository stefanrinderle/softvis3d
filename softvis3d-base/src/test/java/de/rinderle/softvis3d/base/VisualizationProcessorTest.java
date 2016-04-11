/*
 * softvis3d-base
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
package de.rinderle.softvis3d.base;

import de.rinderle.softvis3d.base.domain.LayoutViewType;
import de.rinderle.softvis3d.base.domain.SnapshotTreeResult;
import de.rinderle.softvis3d.base.domain.graph.ResultPlatform;
import de.rinderle.softvis3d.base.domain.tree.RootTreeNode;
import de.rinderle.softvis3d.base.layout.LayoutProcessor;
import de.rinderle.softvis3d.base.postprocessing.PostProcessor;
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

    final RootTreeNode tree = new RootTreeNode("1");
    final SnapshotTreeResult snapShotTreeResult = new SnapshotTreeResult(tree);
    final Map<String, ResultPlatform> resultGraphs = new HashMap<>();

    when(layoutProcessor.process(eq(settings), eq(LayoutViewType.CITY), eq(snapShotTreeResult), any(VisualizationAdditionalInfos.class))).thenReturn(resultGraphs);

    final Map<String, ResultPlatform> result = underTest.visualize(LayoutViewType.CITY, settings, snapShotTreeResult, null);

    assertEquals(resultGraphs, result);
  }
}
