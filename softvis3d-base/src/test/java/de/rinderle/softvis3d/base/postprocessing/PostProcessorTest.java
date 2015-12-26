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
package de.rinderle.softvis3d.base.postprocessing;

import att.grappa.Graph;
import att.grappa.GrappaBox;
import de.rinderle.softvis3d.base.domain.LayoutViewType;
import de.rinderle.softvis3d.base.domain.SnapshotTreeResult;
import de.rinderle.softvis3d.base.domain.graph.ResultPlatform;
import de.rinderle.softvis3d.base.domain.tree.RootTreeNode;
import de.rinderle.softvis3d.base.layout.format.GrappaGraphTestFactory;
import java.util.HashMap;
import java.util.Map;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

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
    final int id = 1;
    final Map<Integer, ResultPlatform> resultGraphs = new HashMap<>();
    final ResultPlatform platform = new ResultPlatform(new Graph("root"));
    platform.setBoundingBox(new GrappaBox(0, 0, 100, 200));
    resultGraphs.put(id, platform);

    final SnapshotTreeResult treeResult = new SnapshotTreeResult(new RootTreeNode(id));

    underTest.process(LayoutViewType.CITY, resultGraphs, treeResult);
  }

  @Test
  public void testProcessWithChildren() throws Exception {
    final int id = 1;
    final Map<Integer, ResultPlatform> resultGraphs = new HashMap<>();

    final ResultPlatform platform = GrappaGraphTestFactory.createPlatform();
    platform.setBoundingBox(new GrappaBox(0, 0, 100, 200));
    resultGraphs.put(id, platform);

    final SnapshotTreeResult treeResult = new SnapshotTreeResult(new RootTreeNode(id));

    underTest.process(LayoutViewType.CITY, resultGraphs, treeResult);
  }

}
