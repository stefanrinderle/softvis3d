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

import de.rinderle.softvis3d.cache.SnapshotCacheService;
import de.rinderle.softvis3d.domain.sonar.SonarDependency;
import de.rinderle.softvis3d.domain.sonar.SonarDependencyBuilder;
import de.rinderle.softvis3d.domain.tree.DependencyTreeNode;
import de.rinderle.softvis3d.domain.tree.RootTreeNode;
import de.rinderle.softvis3d.domain.tree.TreeNode;
import de.rinderle.softvis3d.domain.tree.TreeNodeType;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertTrue;

/**
 * Checks that the dependency expander creates dependency nodes and does the counting right..
 */
public class DependencyExpanderCheckCounterTest {

  @InjectMocks
  private final DependencyExpanderBean underTest = new DependencyExpanderBean();
  @Mock
  private SnapshotCacheService treeService;

  @Before
  public void setUp() {
    MockitoAnnotations.initMocks(this);
  }

  /**
   *
   * A(1) / \ B(2)-->C(3) <--
   *
   **/
  @Test
  public void testDependenciesFlatEdges() {
    final List<SonarDependency> dependencies = new ArrayList<SonarDependency>();

    final SonarDependency fromBtoC = this.createDependency(2, 3);
    dependencies.add(fromBtoC);
    final SonarDependency fromCtoB = this.createDependency(3, 2);
    dependencies.add(fromCtoB);

    final RootTreeNode treeNode1 = new RootTreeNode(1);
    final TreeNode treeNode2 = this.createTreeNode(2, treeNode1, 1);
    final TreeNode treeNode3 = this.createTreeNode(3, treeNode1, 2);

    this.underTest.execute(treeNode1, dependencies);

    assertTrue(treeNode2.getEdges().containsKey("depPath_3"));
    assertTrue(treeNode2.getEdges().get("depPath_3").getIncludingDependenciesSize() == 1);
    assertTrue(treeNode3.getEdges().containsKey("depPath_2"));
    assertTrue(treeNode3.getEdges().get("depPath_2").getIncludingDependenciesSize() == 1);

    assertTrue(treeNode1.getEdges().isEmpty());
  }

  /**
   * A(1) / \ B(2)-->C(3) -->
   *
   **/
  @Test
  public void testDependenciesSameFlatEdge() {
    final List<SonarDependency> dependencies = new ArrayList<SonarDependency>();

    final SonarDependency fromBtoC = this.createDependency(2, 3);
    dependencies.add(fromBtoC);
    dependencies.add(fromBtoC);

    final RootTreeNode rootTreeNode = new RootTreeNode(1);
    final TreeNode treeNode2 = this.createTreeNode(2, rootTreeNode, 1);
    final TreeNode treeNode3 = this.createTreeNode(3, rootTreeNode, 2);

    this.underTest.execute(rootTreeNode, dependencies);

    assertTrue(treeNode2.getEdges().containsKey("depPath_3"));
    assertTrue(treeNode2.getEdges().get("depPath_3").getIncludingDependenciesSize() == 2);

    assertTrue(rootTreeNode.getEdges().isEmpty());
    assertTrue(treeNode3.getEdges().isEmpty());
  }

  /**
   * A(1) / \ B(2) D(4) / > \ / / \ C(3)--/ E(5) ------->
   *
   **/
  @Test
  public void testMultipleDependencyEdges() {
    final List<SonarDependency> dependencies = new ArrayList<SonarDependency>();

    final SonarDependency fromCtoD = this.createDependency(3, 4);
    dependencies.add(fromCtoD);
    final SonarDependency fromCtoE = this.createDependency(3, 5);
    dependencies.add(fromCtoE);

    final RootTreeNode treeNode1 = new RootTreeNode(1);
    final TreeNode treeNode2 = this.createTreeNode(2, treeNode1, 1);
    final TreeNode treeNode3 = this.createTreeNode(3, treeNode2, 2);
    final TreeNode treeNode4 = this.createTreeNode(4, treeNode1, 1);
    final TreeNode treeNode5 = this.createTreeNode(5, treeNode4, 2);

    final TreeNode interfaceLeafNode2 = this.createInterfaceLeafNode(90, treeNode2);
    final TreeNode interfaceLeafNode4 = this.createInterfaceLeafNode(91, treeNode4);

    this.underTest.execute(treeNode1, dependencies);

    // dependency elevator edge start
    assertTrue(treeNode3.getEdges().containsKey("depPath_90"));
    assertTrue(treeNode3.getEdges().get("depPath_90").getIncludingDependenciesSize() == 2);
    // flat edge
    assertTrue(treeNode2.getEdges().containsKey("depPath_4"));
    assertTrue(treeNode2.getEdges().get("depPath_4").getIncludingDependenciesSize() == 2);
    // dependency elevator edge end
    assertTrue(interfaceLeafNode4.getEdges().containsKey("depPath_5"));
    assertTrue(interfaceLeafNode4.getEdges().get("depPath_5").getIncludingDependenciesSize() == 1);

    assertTrue(treeNode5.getEdges().isEmpty());
    assertTrue(interfaceLeafNode2.getEdges().isEmpty());
  }

  private TreeNode createTreeNode(final int id, final TreeNode parent, final int depth) {
    final TreeNode result = new TreeNode(id, parent, depth, TreeNodeType.TREE, id + "");

    parent.addChildrenNode(id + "", result);

    return result;
  }

  private TreeNode createInterfaceLeafNode(final int id, final TreeNode parent) {
    final DependencyTreeNode result = new DependencyTreeNode(id, parent, parent.getDepth() + 1);

    final String intLeafLabel = DependencyExpanderBean.INTERFACE_PREFIX + "_" + parent.getId();

    parent.addChildrenNode(intLeafLabel, result);

    return result;
  }

  private SonarDependency createDependency(final int from, final int to) {
    final SonarDependencyBuilder result = new SonarDependencyBuilder();

    result.withId(new Long(from + "" + to));
    result.withFromSnapshotId(from);
    result.withToSnapshotId(to);

    return result.createSonarDependency();
  }

}
