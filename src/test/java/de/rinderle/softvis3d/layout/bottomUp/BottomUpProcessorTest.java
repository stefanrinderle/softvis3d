/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.layout.bottomUp;

import de.rinderle.softvis3d.cache.SnapshotCacheService;
import org.junit.Before;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

public class BottomUpProcessorTest {

  private static final Integer METRIC_FOOTPRINT = 0;
  private static final Integer METRIC_HEIGHT = 0;

  private static final String MAP_KEY = "1";

  @Mock
  private SnapshotCacheService snapshotCacheService;
  @Mock
  private SnapshotVisitor mockVisitor;

  @InjectMocks
  private BottomUpLayoutBean underTest = new BottomUpLayoutBean();

  @Before
  public void setUp() {
    MockitoAnnotations.initMocks(this);
  }

  // @Test
  // public void testEmpty() throws DotExecutorException {
  // final Integer snapshotId = 1;
  //
  // this.underTest.accept(this.mockVisitor, snapshotId, MAP_KEY);
  //
  // verify(this.resourceTreeService, times(1)).getChildrenLeafIds(MAP_KEY, snapshotId);
  // verify(this.resourceTreeService, times(1)).getChildrenNodeIds(MAP_KEY, snapshotId);
  // }
  //
  // @Test
  // public void testChildrenNodes() throws DotExecutorException {
  // final Integer snapshotId = 1;
  // final int depth = 0;
  //
  // final List<TreeNode> childrenTreeNodes = new ArrayList<TreeNode>();
  // childrenTreeNodes.add(new TreeNode(2, null, depth, TreeNodeType.TREE, "2", METRIC_FOOTPRINT, METRIC_HEIGHT));
  // childrenTreeNodes.add(new TreeNode(2, null, depth, TreeNodeType.TREE, "3", METRIC_FOOTPRINT, METRIC_HEIGHT));
  // when(this.resourceTreeService.getChildrenNodeIds(MAP_KEY, snapshotId)).thenReturn(childrenTreeNodes);
  //
  // this.underTest.accept(this.mockVisitor, snapshotId, MAP_KEY);
  //
  // // verify(this.resourceTreeService, times(3)).getChildrenLeafIds(eq(MAP_KEY), eq(snapshotId));
  // // verify(this.resourceTreeService, times(3)).getChildrenNodeIds(eq(MAP_KEY), eq(snapshotId));
  // }
  //
  // @Test
  // public void testChildrenLeaves() throws DotExecutorException {
  // final Integer snapshotId = 1;
  // final int depth = 0;
  //
  // final List<TreeNode> childrenTreeLeaves = new ArrayList<TreeNode>();
  // childrenTreeLeaves.add(new TreeNode(2, null, depth, TreeNodeType.TREE, "2", METRIC_FOOTPRINT, METRIC_HEIGHT));
  // childrenTreeLeaves.add(new TreeNode(2, null, depth, TreeNodeType.TREE, "3", METRIC_FOOTPRINT, METRIC_HEIGHT));
  // when(this.resourceTreeService.getChildrenLeafIds(MAP_KEY, snapshotId)).thenReturn(childrenTreeLeaves);
  //
  // this.underTest.accept(this.mockVisitor, snapshotId, MAP_KEY);
  //
  // verify(this.resourceTreeService, times(1)).getChildrenNodeIds(eq(MAP_KEY), eq(snapshotId));
  // verify(this.resourceTreeService, times(1)).getChildrenLeafIds(eq(MAP_KEY), eq(snapshotId));
  // }

}
