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
package de.rinderle.softviz3d.layout.calc.bottomup;

import de.rinderle.softviz3d.layout.calc.LayoutViewType;
import de.rinderle.softviz3d.layout.dot.DotExcecutorException;
import de.rinderle.softviz3d.tree.ResourceTreeService;
import de.rinderle.softviz3d.tree.TreeNode;
import de.rinderle.softviz3d.tree.TreeNodeType;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.List;

import static org.mockito.Matchers.anyInt;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.*;

public class BottomUpProcessorTest {

  private static final Integer METRIC_FOOTPRINT = 0;
  private static final Integer METRIC_HEIGHT = 0;

  private static final LayoutViewType VIEW_TYPE = LayoutViewType.CITY;

  @Mock
  private ResourceTreeService resourceTreeService;
  @Mock
  private SnapshotVisitor mockVisitor;

  @InjectMocks
  private BottomUpProcessor underTest = new BottomUpProcessor();

  @Before
  public void setUp() {
    MockitoAnnotations.initMocks(this);
  }

  @Test
  public void testEmpty() throws DotExcecutorException {
    Integer snapshotId = 1;

    underTest.accept(VIEW_TYPE, mockVisitor, snapshotId, snapshotId);

    verify(resourceTreeService, times(1)).getChildrenLeafIds(VIEW_TYPE, snapshotId, snapshotId);
    verify(resourceTreeService, times(1)).getChildrenNodeIds(VIEW_TYPE, snapshotId, snapshotId);
  }

  @Test
  public void testChildrenNodes() throws DotExcecutorException {
    Integer snapshotId = 1;
    int depth = 0;

    List<TreeNode> childrenTreeNodes = new ArrayList<TreeNode>();
    childrenTreeNodes.add(new TreeNode(2, null, depth, TreeNodeType.TREE, "2", METRIC_FOOTPRINT, METRIC_HEIGHT));
    childrenTreeNodes.add(new TreeNode(2, null, depth, TreeNodeType.TREE, "3", METRIC_FOOTPRINT, METRIC_HEIGHT));
    when(resourceTreeService.getChildrenNodeIds(VIEW_TYPE, snapshotId, snapshotId)).thenReturn(childrenTreeNodes);

    underTest.accept(VIEW_TYPE, mockVisitor, snapshotId, snapshotId);

    verify(resourceTreeService, times(3)).getChildrenLeafIds(eq(VIEW_TYPE), eq(snapshotId), anyInt());
    verify(resourceTreeService, times(3)).getChildrenNodeIds(eq(VIEW_TYPE), eq(snapshotId), anyInt());
  }

  @Test
  public void testChildrenLeaves() throws DotExcecutorException {
    Integer snapshotId = 1;
    int depth = 0;

    List<TreeNode> childrenTreeLeaves = new ArrayList<TreeNode>();
    childrenTreeLeaves.add(new TreeNode(2, null, depth, TreeNodeType.TREE, "2", METRIC_FOOTPRINT, METRIC_HEIGHT));
    childrenTreeLeaves.add(new TreeNode(2, null, depth, TreeNodeType.TREE, "3", METRIC_FOOTPRINT, METRIC_HEIGHT));
    when(resourceTreeService.getChildrenLeafIds(VIEW_TYPE, snapshotId, snapshotId)).thenReturn(childrenTreeLeaves);

    underTest.accept(VIEW_TYPE, mockVisitor, snapshotId, snapshotId);

    verify(resourceTreeService, times(1)).getChildrenNodeIds(eq(VIEW_TYPE), eq(snapshotId), anyInt());
    verify(resourceTreeService, times(1)).getChildrenLeafIds(eq(VIEW_TYPE), eq(snapshotId), anyInt());
  }

}
