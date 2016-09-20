/**
 * SoftVis3D Sonar plugin
 * Copyright (C) 2016 Stefan Rinderle and Yvo Niedrich
 * stefan@rinderle.info / yvo.niedrich@gmail.com
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

  @Test
  public void testGetMinMaxForColorMetric() throws Exception {
    final RootTreeNode tree = new RootTreeNode("1");
    final TreeNode leafTwo = new ValueTreeNode("2", tree, 1, TreeNodeType.TREE, "2", 0, 0, 3);
    tree.addChildrenNode("2", leafTwo);
    final TreeNode leafThree = new ValueTreeNode("2", tree, 1, TreeNodeType.TREE, "2", 0, 0, -17);
    tree.addChildrenNode("3", leafThree);
    final TreeNode leafFour = new ValueTreeNode("4", tree, 1, TreeNodeType.TREE, "2", 0, 0, 846);
    tree.addChildrenNode("4", leafFour);

    final MinMaxValue result = new MinMaxCalculator(tree).getMinMaxForColorMetric();

    assertTrue(-17.0 == result.getMinValue());
    assertTrue(846.0 == result.getMaxValue());
  }
}
