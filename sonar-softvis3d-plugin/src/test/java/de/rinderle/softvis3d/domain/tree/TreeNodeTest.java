package de.rinderle.softvis3d.domain.tree;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

/**
 * Created by stefanrinderle on 23.04.16.
 */
public class TreeNodeTest {

  private static final String ID = "1";
  private static final TreeNode PARENT = null;
  private static final int DEPTH = 1;
  private static final String NAME = "1";

  @Test
  public void testBase() {
    final TreeNode underTest = new TreeNode(ID, PARENT, DEPTH, TreeNodeType.TREE, NAME);

    assertEquals(DEPTH, underTest.getDepth().intValue());
    assertEquals(ID, underTest.getId());
    assertEquals(NAME, underTest.getName());
    assertNull(underTest.getParent());
    assertEquals(TreeNodeType.TREE, underTest.getType());

    assertEquals(0, underTest.getChildren().size());
  }

  @Test
  public void testBaseChildren() {
    final TreeNode underTest = new TreeNode(ID, PARENT, DEPTH, TreeNodeType.TREE, NAME);

    final String key = "3";
    final TreeNode child = new TreeNode(key, underTest, 1, TreeNodeType.TREE, key);
    underTest.getChildren().put(key, child);

    assertEquals(1, underTest.getChildren().size());
    assertEquals(0, underTest.getAllChildrenNodesSize());
    assertEquals(0, underTest.getAllChildrenValueLeaves().size());
    assertEquals(1, underTest.getChildrenLeaves().size());
    assertEquals(0, underTest.getChildrenNodes().size());
  }

  @Test
  public void testBaseChildrenChildren() {
    final TreeNode underTest = new TreeNode(ID, PARENT, DEPTH, TreeNodeType.TREE, NAME);

    final String key = "3";
    final TreeNode child = new TreeNode(key, underTest, 1, TreeNodeType.TREE, key);

    final TreeNode childChild = new TreeNode("4", child, 2, TreeNodeType.TREE, key);
    child.addChildrenNode("4", childChild);

    underTest.getChildren().put(key, child);

    assertEquals(1, underTest.getChildren().size());
    assertEquals(1, underTest.getAllChildrenNodesSize());
    assertEquals(0, underTest.getAllChildrenValueLeaves().size());
    assertEquals(0, underTest.getChildrenLeaves().size());
    assertEquals(1, underTest.getChildrenNodes().size());
  }

}