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
package de.rinderle.softvis3d.layout.bottomup;

import de.rinderle.softvis3d.TestTreeBuilder;
import de.rinderle.softvis3d.domain.LayoutViewType;
import de.rinderle.softvis3d.domain.SnapshotStorageKey;
import de.rinderle.softvis3d.domain.SnapshotTreeResult;
import de.rinderle.softvis3d.domain.VisualizationRequest;
import de.rinderle.softvis3d.domain.layout.LayeredLayoutElement;
import de.rinderle.softvis3d.domain.tree.RootTreeNode;
import de.rinderle.softvis3d.domain.tree.TreeNode;
import de.rinderle.softvis3d.layout.dot.DotExecutorException;
import java.util.List;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertSame;
import static org.mockito.Matchers.anyListOf;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.when;

public class BottomUpLayoutBeanTest {

  @Mock
  private SnapshotVisitor visitor;

  private BottomUpLayoutBean underTest;

  @Before
  public void setUp() {
    MockitoAnnotations.initMocks(this);

    underTest = new BottomUpLayoutBean(visitor);
  }

  @Test
  public void testAccept() throws Exception {
    final int snapshotId = 1;
    final VisualizationRequest requestDTO = new VisualizationRequest(snapshotId, LayoutViewType.CITY, 1, 1);
    final SnapshotStorageKey storageKey = new SnapshotStorageKey(requestDTO);

    final RootTreeNode tree = new RootTreeNode(snapshotId);
    final SnapshotTreeResult snapshotTreeResult = new SnapshotTreeResult(storageKey, tree);

    final LayeredLayoutElement resultElement = LayeredLayoutElement.createLayeredLayoutElement(tree, null, null, null, null);
    when(visitor.visitNode(eq(tree), anyListOf(LayeredLayoutElement.class))).thenReturn(resultElement);

    final LayeredLayoutElement result = underTest.accept(snapshotTreeResult);
    assertEquals(snapshotId, result.getId().intValue());
  }

  @Test
  public void testAcceptTree() throws Exception {
    final int snapshotId = 1;

    final RootTreeNode tree = new RootTreeNode(snapshotId);

    final LayeredLayoutElement resultElement = LayeredLayoutElement.createLayeredLayoutElement(tree, null, null, null, null);
    when(visitor.visitNode(eq(tree), anyListOf(LayeredLayoutElement.class))).thenReturn(resultElement);

    final LayeredLayoutElement result = underTest.accept(tree);
    assertEquals(snapshotId, result.getId().intValue());
  }

  /**
   *      A(1)
   *     /   \
   *    B(2) D(5)
   *   /  \
   * C(3) E(4)
   *
   **/
  @Test
  public void testProcessChildrenNodes() throws DotExecutorException {
    final Long nodeId = 1L;

    final RootTreeNode treeNode1 = new RootTreeNode(1);
    final TreeNode treeNode2 = TestTreeBuilder.createTreeNode(nodeId.intValue(), treeNode1, 1);
    TestTreeBuilder.createTreeNode(3, treeNode2, 2);
    TestTreeBuilder.createTreeNode(4, treeNode2, 1);
    TestTreeBuilder.createTreeNode(5, treeNode1, 2);

    final LayeredLayoutElement resultElement = LayeredLayoutElement.createLayeredLayoutElement(treeNode2, null, null, null, null);
    when(visitor.visitNode(eq(treeNode2), anyListOf(LayeredLayoutElement.class))).thenReturn(resultElement);

    final List<LayeredLayoutElement> result = underTest.processChildrenNodes(treeNode1);

    assertEquals(1, result.size());
    assertSame(nodeId.intValue(), result.get(0).getId());
  }

  /**
   *      A(1)
   *     /   \
   *    B(2) D(5)
   *   /  \
   * C(3) E(4)
   *
   **/
  @Test
  public void testProcessChildrenLeaves() throws DotExecutorException {
    final Long nodeId = 5L;

    final RootTreeNode treeNode1 = new RootTreeNode(1);
    final TreeNode treeNode2 = TestTreeBuilder.createTreeNode(2, treeNode1, 1);
    TestTreeBuilder.createTreeNode(3, treeNode2, 2);
    TestTreeBuilder.createTreeNode(4, treeNode2, 1);
    final TreeNode treeNode5 = TestTreeBuilder.createTreeNode(nodeId.intValue(), treeNode1, 2);

    final LayeredLayoutElement leafResultElement =
      LayeredLayoutElement.createLayeredLayoutElement(treeNode5, null, null, null, null);
    when(visitor.visitFile(eq(treeNode5))).thenReturn(leafResultElement);

    final List<LayeredLayoutElement> result = underTest.processChildrenLeaves(treeNode1);

    assertEquals(1, result.size());
    assertSame(nodeId.intValue(), result.get(0).getId());
  }

}
