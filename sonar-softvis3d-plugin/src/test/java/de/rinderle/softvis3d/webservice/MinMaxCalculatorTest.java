package de.rinderle.softvis3d.webservice;

import de.rinderle.softvis3d.base.domain.MinMaxValue;
import de.rinderle.softvis3d.base.domain.tree.RootTreeNode;
import de.rinderle.softvis3d.base.domain.tree.TreeNode;
import de.rinderle.softvis3d.base.domain.tree.TreeNodeType;
import de.rinderle.softvis3d.base.domain.tree.ValueTreeNode;
import org.junit.Test;

import static org.junit.Assert.assertTrue;

/**
 * Created by stefanrinderle on 12.04.16.
 */
public class MinMaxCalculatorTest {

  @Test
  public void testGetMinMaxForFootprintMetric() throws Exception {
    final RootTreeNode tree = new RootTreeNode("1");
    final TreeNode leafTwo = new ValueTreeNode("2", tree, 1, TreeNodeType.TREE, "2", 3, 0, 0);
    tree.addChildrenNode("2", leafTwo);
    final TreeNode leafThree = new ValueTreeNode("3", tree, 1, TreeNodeType.TREE, "2", 15, 0, 0);
    tree.addChildrenNode("3", leafThree);
    final TreeNode leafFour = new ValueTreeNode("4", tree, 1, TreeNodeType.TREE, "2", -14, 0, 0);
    tree.addChildrenNode("4", leafFour);

    final MinMaxValue result = new MinMaxCalculator(tree).getMinMaxForFootprintMetric();

    assertTrue(-14.0 == result.getMinValue());
    assertTrue(15.0 == result.getMaxValue());
  }

  @Test
  public void testGetMinMaxForHeightMetric() throws Exception {
    final RootTreeNode tree = new RootTreeNode("1");
    final TreeNode leafTwo = new ValueTreeNode("2", tree, 1, TreeNodeType.TREE, "2", 0, 2, 0);
    tree.addChildrenNode("2", leafTwo);
    final TreeNode leafThree = new ValueTreeNode("2", tree, 1, TreeNodeType.TREE, "2", 0, -14, 0);
    tree.addChildrenNode("3", leafThree);
    final TreeNode leafFour = new ValueTreeNode("4", tree, 1, TreeNodeType.TREE, "2", 0, 28, 0);
    tree.addChildrenNode("4", leafFour);

    final MinMaxValue result = new MinMaxCalculator(tree).getMinMaxForHeightMetric();

    assertTrue(-14.0 == result.getMinValue());
    assertTrue(28.0 == result.getMaxValue());
  }
}
