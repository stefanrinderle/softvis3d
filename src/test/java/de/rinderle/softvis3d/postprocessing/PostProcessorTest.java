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
package de.rinderle.softvis3d.postprocessing;

import att.grappa.Graph;
import att.grappa.GrappaBox;
import de.rinderle.softvis3d.domain.LayoutViewType;
import de.rinderle.softvis3d.domain.SnapshotStorageKey;
import de.rinderle.softvis3d.domain.SnapshotTreeResult;
import de.rinderle.softvis3d.domain.VisualizationRequest;
import de.rinderle.softvis3d.domain.graph.ResultPlatform;
import de.rinderle.softvis3d.domain.tree.RootTreeNode;
import de.rinderle.softvis3d.layout.format.GrappaGraphTestFactory;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by stefan on 12.07.15.
 */
public class PostProcessorTest {

  @InjectMocks
  private final PostProcessor underTest = new PostProcessor();

  @Mock
  private TranslateArrow translateArrow;

  @Before
  public void setUp() {
    MockitoAnnotations.initMocks(this);
  }

  @Test
  public void testProcessMinimal() throws Exception {
    int id = 1;
    Map<Integer, ResultPlatform> resultGraphs = new HashMap<>();
    ResultPlatform platform = new ResultPlatform(new Graph("root"));
    platform.setBoundingBox(new GrappaBox(0, 0, 100, 200));
    resultGraphs.put(id, platform);

    VisualizationRequest requestDTO = new VisualizationRequest(id, LayoutViewType.CITY, 1, 20);
    SnapshotStorageKey key = new SnapshotStorageKey(requestDTO);
    SnapshotTreeResult treeResult = new SnapshotTreeResult(key, new RootTreeNode(id));

    underTest.process(LayoutViewType.CITY, resultGraphs, treeResult);

  }

  @Test
  public void testProcessWithChildren() throws Exception {
    int id = 1;
    Map<Integer, ResultPlatform> resultGraphs = new HashMap<>();

    ResultPlatform platform = GrappaGraphTestFactory.createPlatform();
    platform.setBoundingBox(new GrappaBox(0, 0, 100, 200));
    resultGraphs.put(id, platform);

    VisualizationRequest requestDTO = new VisualizationRequest(id, LayoutViewType.CITY, 1, 20);
    SnapshotStorageKey key = new SnapshotStorageKey(requestDTO);
    SnapshotTreeResult treeResult = new SnapshotTreeResult(key, new RootTreeNode(id));

    underTest.process(LayoutViewType.CITY, resultGraphs, treeResult);

  }
}
