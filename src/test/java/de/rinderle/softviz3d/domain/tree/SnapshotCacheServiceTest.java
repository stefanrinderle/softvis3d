/*
 * SoftViz3d Sonar plugin
 * Copyright (C) 2013 Stefan Rinderle
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
package de.rinderle.softviz3d.domain.tree;

import de.rinderle.softviz3d.cache.SnapshotCacheServiceBean;
import de.rinderle.softviz3d.dao.DaoService;
import de.rinderle.softviz3d.domain.LayoutViewType;
import de.rinderle.softviz3d.preprocessing.tree.OptimizeTreeStructure;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.List;

public class SnapshotCacheServiceTest {

  private static final LayoutViewType VIEW_TYPE = LayoutViewType.CITY;

  @Mock
  private DaoService daoService;
  @Mock
  private OptimizeTreeStructure optimizeTreeStructure;

  @InjectMocks
  private SnapshotCacheServiceBean underTest;

  @Before
  public void setup() {
    MockitoAnnotations.initMocks(this);
  }

  // @Test
  // public void test() {
  // final int rootSnapshotId = 1;
  //
  // List<SonarSnapshotDTO> children = new ArrayList<SonarSnapshotDTO>();
  // children.add(new SonarSnapshotDTO(2, "src", 0.0, 0.0));
  // children.add(new SonarSnapshotDTO(3, "src/eins", 0.0, 0.0));
  // children.add(new SonarSnapshotDTO(4, "src/zwei", 0.0, 0.0));
  // children.add(new SonarSnapshotDTO(5, "src/zwei/drei", 0.0, 0.0));
  //
  // final VisualizationRequestDTO requestDTO = new VisualizationRequestDTO(rootSnapshotId, VIEW_TYPE, 0, 0);
  //
  // when(this.sonarService.getFlatChildrenWithMetrics(requestDTO)).thenReturn(children);
  //
  // this.underTest.getOrCreateTreeStructure(requestDTO);
  //
  // // Check leaf
  // // List<TreeNode> leafs = underTest.getChildrenLeafIds(VIEW_TYPE, rootSnapshotId, rootSnapshotId);
  // // assertTrue(leafs.contains(3));
  // // assertEquals(1, leafs.size());
  //
  // // Check node
  // // List<TreeNode> nodes = underTest.getChildrenNodeIds(VIEW_TYPE, rootSnapshotId, 4);
  // // assertTrue(nodes.contains(4));
  // // assertEquals(1, nodes.size());
  // }

  @Test
  public void testLongSameIdInTree() {
    final int snapshotId = 1;

    final List<Object[]> children = new ArrayList<Object[]>();
    children.add(new Object[] {2, "src/eins/zwei/drei"});
    children.add(new Object[] {3, "src/eins/zwei/drei/child1"});
    children.add(new Object[] {4, "src/eins/zwei/drei/child2"});
    // when(sonarDao.getAllChildrenFlat(snapshotId)).thenReturn(children);
    //
    // underTest.getOrCreateTreeStructure(snapshotId);

    // Check leaf
    // List<Integer> leafs = underTest.getChildrenLeafIds(2);
    // assertTrue(leafs.contains(3));
    // assertEquals(2, leafs.size());

    // Check node
    // List<Integer> nodes = underTest.getChildrenNodeIds(1);
    // assertEquals(1, nodes.size());
  }

  @Test
  public void test2() {
    final int snapshotId = 573;

    final List<Object[]> children = new ArrayList<Object[]>();
    children.add(new Object[] {574, "app/base"});
    children.add(new Object[] {575, "app/base/Global.java"});
    children.add(new Object[] {576, "app/base/Global_deplete_do_not_commit.java"});
    children.add(new Object[] {577, "app/controllers"});
    children.add(new Object[] {578, "app/controllers/ApplicationController.java"});
    children.add(new Object[] {579, "app/controllers/ChartsController.java"});
    children.add(new Object[] {580, "app/controllers/CityController.java"});
    children.add(new Object[] {581, "app/controllers/ForecastController.java"});
    children.add(new Object[] {582, "app/controllers/MobileController.java"});
    children.add(new Object[] {583, "app/controllers/StaticPageController.java"});
    children.add(new Object[] {584, "app/controllers/WebserviceTestController.java"});
    children.add(new Object[] {585, "app/dto"});
    children.add(new Object[] {586, "app/dto/ClothesDTO.java"});
    children.add(new Object[] {587, "app/dto/ClothesForecastDTO.java"});

    // when(sonarDao.getAllChildrenFlat(snapshotId)).thenReturn(children);
    //
    // underTest.getOrCreateTreeStructure(snapshotId);

    // Check leaf
    // List<Integer> leafs = underTest.getChildrenLeafIds(574);
    // assertEquals(2, leafs.size());
    // assertTrue(leafs.contains(576));
    //
    // // Check node
    // List<Integer> nodes = underTest.getChildrenNodeIds(573);
    // assertFalse(nodes.contains(574));
    //
    // List<Integer> childsFromGenerated = underTest.getChildrenNodeIds(nodes.get(0));
    // assertTrue(childsFromGenerated.contains(574));
    // assertTrue(childsFromGenerated.contains(577));
    // assertTrue(childsFromGenerated.contains(585));

  }
}
