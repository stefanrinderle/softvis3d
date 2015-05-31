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
package de.rinderle.softvis3d.preprocessing.dependencies;

import de.rinderle.softvis3d.TestTreeBuilder;
import de.rinderle.softvis3d.cache.SnapshotCacheService;
import de.rinderle.softvis3d.domain.sonar.SonarDependency;
import de.rinderle.softvis3d.domain.tree.RootTreeNode;
import de.rinderle.softvis3d.domain.tree.TreeNode;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertTrue;

public class DependencyExpanderTest {

  @InjectMocks
  private final DependencyExpanderBean underTest = new DependencyExpanderBean();
  @Mock
  private SnapshotCacheService treeService;

  @Before
  public void setUp() {
    MockitoAnnotations.initMocks(this);
  }

  /**
   * A(1)exa
   * /    \
   * B(2)-->C(3)
   * <--
   */
  @Test
  public void testDependenciesFlatEdges() {
    final List<SonarDependency> dependencies = new ArrayList<SonarDependency>();

    final SonarDependency fromBtoC = TestTreeBuilder.createDependency("1000", 2, 3);
    dependencies.add(fromBtoC);

    final RootTreeNode rootTreeNode = new RootTreeNode(1);
    final TreeNode treeNode2 = TestTreeBuilder.createTreeNode(2, rootTreeNode, 1);
    final TreeNode treeNode3 = TestTreeBuilder.createTreeNode(3, rootTreeNode, 2);

    this.underTest.execute(rootTreeNode, dependencies);

    assertTrue(treeNode2.getEdges().containsKey("depPath_3"));
    assertTrue(treeNode2.getEdges().get("depPath_3")
      .getIncludingDependenciesSize() == 1);

    assertTrue(rootTreeNode.getEdges().isEmpty());
  }

  /**
   *     A(1)
   *    /   \
   * B(2)-->C(3)
   *     -->
   */
  @Test
  public void testDependenciesSameFlatEdge() {
    final List<SonarDependency> dependencies = new ArrayList<SonarDependency>();

    final SonarDependency fromBtoC1 = TestTreeBuilder.createDependency("1002", 2, 3);
    final SonarDependency fromBtoC2 = TestTreeBuilder.createDependency("1003", 2, 3);
    dependencies.add(fromBtoC1);
    dependencies.add(fromBtoC2);

    final RootTreeNode rootTreeNode = new RootTreeNode(1);
    final TreeNode treeNode2 = TestTreeBuilder.createTreeNode(2, rootTreeNode, 1);
    final TreeNode treeNode3 = TestTreeBuilder.createTreeNode(3, rootTreeNode, 2);

    this.underTest.execute(rootTreeNode, dependencies);

    assertTrue(treeNode2.getEdges().containsKey("depPath_3"));
    assertTrue(treeNode2.getEdges().get("depPath_3")
      .getIncludingDependenciesSize() == 2);

    assertTrue(rootTreeNode.getEdges().isEmpty());
    assertTrue(treeNode3.getEdges().isEmpty());
  }

  /**
   *       A(1)
   *       / \
   *     B(2) D(4)
   *     /     \
   *    /       \
   * C(3) ----> E(5)
   *
   */
  @Test
  public void testDependencyEdge() {
    final List<SonarDependency> dependencies = new ArrayList<SonarDependency>();

    final SonarDependency fromCtoE = TestTreeBuilder.createDependency("1000", 3, 5);
    dependencies.add(fromCtoE);

    final RootTreeNode rootTreeNode = new RootTreeNode(1);
    final TreeNode treeNode2 = TestTreeBuilder.createTreeNode(2, rootTreeNode, 1);
    final TreeNode treeNode4 = TestTreeBuilder.createTreeNode(4, rootTreeNode, 1);

    final TreeNode treeNode3 = TestTreeBuilder.createTreeNode(3, treeNode2, 2);
    final TreeNode treeNode5 = TestTreeBuilder.createTreeNode(5, treeNode4, 2);

    this.underTest.execute(rootTreeNode, dependencies);

    // dependency elevator edge start
    assertTrue(treeNode3.getEdges().size() == 1);
    assertTrue(treeNode2.getEdges().size() == 1);
    assertTrue(treeNode5.getEdges().isEmpty());
  }

  // private TreeNode createTreeNode(final int id, final TreeNode parent,
  // final int depth) {
  //
  // TreeNode node = new ValueTreeNode(id, parent, depth,
  // TreeNodeType.TREE, id + "", 0, 0, 0);
  // parent.getChildren().put(node.getName(), node);
  //
  // return node;
  // }
  //
  // private SonarDependency createDependency(final String dependencyId, final int from, final int to) {
  // final SonarDependencyBuilder result = new SonarDependencyBuilder();
  //
  // result.withId(new Long(dependencyId));
  // result.withFromSnapshotId(from);
  // result.withToSnapshotId(to);
  //
  // return result.createSonarDependency();
  // }

}
