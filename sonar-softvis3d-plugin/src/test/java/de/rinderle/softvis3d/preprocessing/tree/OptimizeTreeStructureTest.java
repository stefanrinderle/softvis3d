/*
 * SoftVis3D Sonar plugin
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
package de.rinderle.softvis3d.preprocessing.tree;

import de.rinderle.softvis3d.base.domain.tree.RootTreeNode;
import de.rinderle.softvis3d.base.domain.tree.TreeNode;
import de.rinderle.softvis3d.base.domain.tree.TreeNodeType;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertSame;

public class OptimizeTreeStructureTest {

  private final OptimizeTreeStructure normalizer = new OptimizeTreeStructure();

  @Test
  public void testEmptyTree() {
    final String id = "1";

    final RootTreeNode tree = new RootTreeNode("1");
    normalizer.removeUnnecessaryNodes(tree);

    assertEquals(id, tree.getId());

    assertSame(0, tree.getDepth());
  }

  /**
   *      A
   *     /  \
   *    B    C
   *   / \   / \
   *  D  E  F   G
   */
  @Test
  public void testValidTreeDoNotOptimize() {
    final RootTreeNode root = new RootTreeNode("1");
    final TreeNode nodeB = new TreeNode("2", root, 1, TreeNodeType.TREE, "B");
    root.addChildrenNode("B", nodeB);
    final TreeNode nodeC = new TreeNode("3", root, 1, TreeNodeType.TREE, "C");
    root.addChildrenNode("C", nodeC);

    final TreeNode nodeD = new TreeNode("4", nodeB, 2, TreeNodeType.TREE, "D");
    nodeB.addChildrenNode("D", nodeD);
    final TreeNode nodeE = new TreeNode("5", nodeB, 2, TreeNodeType.TREE, "E");
    nodeB.addChildrenNode("E", nodeE);

    final TreeNode nodeF = new TreeNode("6", nodeC, 2, TreeNodeType.TREE, "F");
    nodeC.addChildrenNode("F", nodeF);
    final TreeNode nodeG = new TreeNode("7", nodeC, 2, TreeNodeType.TREE, "G");
    nodeC.addChildrenNode("G", nodeG);

    normalizer.removeUnnecessaryNodes(root);

    assertEquals(2, root.getChildren().size());
    assertEquals(2, nodeB.getChildren().size());
    assertEquals(2, nodeC.getChildren().size());

    assertSame(0, root.getDepth());
    assertSame(1, nodeB.getDepth());
    assertSame(1, nodeC.getDepth());
    assertSame(2, nodeD.getDepth());
    assertSame(2, nodeE.getDepth());
    assertSame(2, nodeF.getDepth());
    assertSame(2, nodeG.getDepth());

  }

  /**
   *      A
   *     /  \
   *    B    C
   *   /    / \
   *  D    F   G
   */
  @Test
  public void testValidTreeOptimizeLeft() {
    final RootTreeNode root = new RootTreeNode("1");
    final TreeNode nodeB = new TreeNode("2", root, 1, TreeNodeType.TREE, "B");
    root.addChildrenNode("B", nodeB);
    final TreeNode nodeC = new TreeNode("3", root, 1, TreeNodeType.TREE, "C");
    root.addChildrenNode("C", nodeC);

    final TreeNode nodeD = new TreeNode("4", nodeB, 2, TreeNodeType.TREE, "D");
    nodeB.addChildrenNode("D", nodeD);

    final TreeNode nodeF = new TreeNode("6", nodeC, 2, TreeNodeType.TREE, "F");
    nodeC.addChildrenNode("F", nodeF);
    final TreeNode nodeG = new TreeNode("7", nodeC, 2, TreeNodeType.TREE, "G");
    nodeC.addChildrenNode("G", nodeG);

    normalizer.removeUnnecessaryNodes(root);

    assertEquals(2, root.getChildren().size());

    // B removed
    assertNull(root.getChildren().get("B"));
    assertNotNull(root.getChildren().get("B/D"));

    assertSame("4", root.getChildren().get("B/D").getId());

    assertSame(0, root.getDepth());
    assertSame(1, nodeC.getDepth());
    assertSame(1, nodeD.getDepth());
    assertSame(2, nodeF.getDepth());
    assertSame(2, nodeG.getDepth());
  }

  /**
   *      A
   *     /  \
   *    B    C
   *   / \   /
   *  D  E  F
   */
  @Test
  public void testValidTreeOptimizeRight() {
    final RootTreeNode root = new RootTreeNode("1");
    final TreeNode nodeB = new TreeNode("2", root, 1, TreeNodeType.TREE, "B");
    root.addChildrenNode("B", nodeB);
    final TreeNode nodeC = new TreeNode("3", root, 1, TreeNodeType.TREE, "C");
    root.addChildrenNode("C", nodeC);

    final TreeNode nodeD = new TreeNode("4", nodeB, 2, TreeNodeType.TREE, "D");
    nodeB.addChildrenNode("D", nodeD);
    final TreeNode nodeE = new TreeNode("5", nodeB, 2, TreeNodeType.TREE, "E");
    nodeB.addChildrenNode("E", nodeE);

    final TreeNode nodeF = new TreeNode("6", nodeC, 2, TreeNodeType.TREE, "F");
    nodeC.addChildrenNode("F", nodeF);

    normalizer.removeUnnecessaryNodes(root);

    assertEquals(2, root.getChildren().size());

    // C removed
    assertNull(root.getChildren().get("C"));
    assertNotNull(root.getChildren().get("C/F"));

    assertSame("6", root.getChildren().get("C/F").getId());

    assertSame(0, root.getDepth());
    assertSame(1, nodeB.getDepth());
    assertSame(2, nodeD.getDepth());
    assertSame(2, nodeE.getDepth());
    assertSame(1, nodeF.getDepth());
  }

  /**
   *       A
   *      / \
   *     B  C
   *    /
   *   D
   *  /
   * E
   *
   */
  @Test
  public void testValidTreeOptimizeMore() {
    final RootTreeNode root = new RootTreeNode("1");
    final TreeNode nodeB = new TreeNode("2", root, 1, TreeNodeType.TREE, "B");
    root.addChildrenNode("B", nodeB);
    final TreeNode nodeC = new TreeNode("3", root, 1, TreeNodeType.TREE, "C");
    root.addChildrenNode("C", nodeC);

    final TreeNode nodeD = new TreeNode("4", nodeB, 2, TreeNodeType.TREE, "D");
    nodeB.addChildrenNode("D", nodeD);

    final TreeNode nodeE = new TreeNode("5", nodeD, 3, TreeNodeType.TREE, "E");
    nodeD.addChildrenNode("E", nodeE);

    normalizer.removeUnnecessaryNodes(root);

    assertEquals(2, root.getChildren().size());

    // B and D removed
    assertNull(root.getChildren().get("B"));
    assertNull(root.getChildren().get("D"));

    assertNotNull(root.getChildren().get("B/D/E"));

    assertSame("5", root.getChildren().get("B/D/E").getId());

    assertSame(0, root.getDepth());
    assertSame(1, nodeC.getDepth());
    assertSame(1, nodeE.getDepth());
  }

}
