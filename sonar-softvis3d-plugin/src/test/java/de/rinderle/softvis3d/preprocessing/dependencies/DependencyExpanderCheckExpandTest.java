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
import de.rinderle.softvis3d.base.domain.tree.RootTreeNode;
import de.rinderle.softvis3d.base.domain.tree.TreeNode;
import de.rinderle.softvis3d.cache.SnapshotCacheService;
import de.rinderle.softvis3d.domain.sonar.SonarDependency;
import java.util.ArrayList;
import java.util.List;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.Assert.assertTrue;

/**
 * Checks that the dependency expander creates dependency nodes and solves the
 * shortest path through the tree.
 */
public class DependencyExpanderCheckExpandTest {

  @InjectMocks
  private final DependencyExpander underTest = new DependencyExpander();
  @Mock
  private SnapshotCacheService treeService;

  @Before
  public void setUp() {
    MockitoAnnotations.initMocks(this);
  }

  @Test
  public void testDependenciesEmpty() {
    final List<SonarDependency> dependencies = new ArrayList<>();

    this.underTest.execute(new RootTreeNode(1), dependencies);

    assertTrue(dependencies.isEmpty());
  }

  /**
   *      A(1)
   *     /   \
   *   B(2)-->C(3)
   *
   **/
  @Test
  public void testDependenciesFlatEdge() {
    final List<SonarDependency> dependencies = new ArrayList<>();

    final SonarDependency fromAtoB = TestTreeBuilder.createDependency(2, 3);
    dependencies.add(fromAtoB);

    final RootTreeNode treeNode1 = new RootTreeNode(1);
    final TreeNode treeNode2 = TestTreeBuilder.createTreeNode(2, treeNode1, 1);
    final TreeNode treeNode3 = TestTreeBuilder.createTreeNode(3, treeNode1, 2);

    this.underTest.execute(treeNode1, dependencies);

    assertTrue(dependencies.contains(fromAtoB));

    assertTrue(treeNode2.getEdges().containsKey("depPath_3"));
    assertTrue(treeNode2.getEdges().get("depPath_3").getSourceId()
      .equals(2));
    assertTrue(treeNode2.getEdges().get("depPath_3").getDestinationId()
      .equals(3));

    assertTrue(treeNode1.getEdges().isEmpty());
    assertTrue(treeNode3.getEdges().isEmpty());
  }

  /**
   *      A(1)
   *     /   \
   *   B(2)<--C(3)
   *
   **/
  @Test
  public void testDependenciesFlatEdgeOtherWayAround() {
    final List<SonarDependency> dependencies = new ArrayList<>();

    final SonarDependency fromAtoB = TestTreeBuilder.createDependency(3, 2);
    dependencies.add(fromAtoB);

    final RootTreeNode treeNode1 = new RootTreeNode(1);
    final TreeNode treeNode2 = TestTreeBuilder.createTreeNode(2, treeNode1, 1);
    final TreeNode treeNode3 = TestTreeBuilder.createTreeNode(3, treeNode1, 2);

    this.underTest.execute(treeNode1, dependencies);

    assertTrue(dependencies.contains(fromAtoB));

    assertTrue(treeNode3.getEdges().containsKey("depPath_2"));
    assertTrue(treeNode3.getEdges().get("depPath_2").getSourceId()
      .equals(3));
    assertTrue(treeNode3.getEdges().get("depPath_2").getDestinationId()
      .equals(2));

    assertTrue(treeNode1.getEdges().isEmpty());
    assertTrue(treeNode2.getEdges().isEmpty());
  }

  /**
   *      A(1)
   *     /   \
   *    B(2) D(4)
   *   /      \
   * C(3)---->E(5)
   *
   **/
  @Test
  public void testDependenciesHierarchicalEdge() {
    final List<SonarDependency> dependencies = new ArrayList<>();

    final SonarDependency fromCtoE = TestTreeBuilder.createDependency(3, 5);
    dependencies.add(fromCtoE);

    final RootTreeNode treeNode1 = new RootTreeNode(1);
    final TreeNode treeNode2 = TestTreeBuilder.createTreeNode(2, treeNode1, 1);
    final TreeNode treeNode3 = TestTreeBuilder.createTreeNode(3, treeNode2, 2);
    final TreeNode treeNode4 = TestTreeBuilder.createTreeNode(4, treeNode1, 1);
    final TreeNode treeNode5 = TestTreeBuilder.createTreeNode(5, treeNode4, 2);

    final TreeNode interfaceLeafNode2 = TestTreeBuilder.createInterfaceLeafNode(90,
      treeNode2);
    final TreeNode interfaceLeafNode4 = TestTreeBuilder.createInterfaceLeafNode(91,
      treeNode4);

    this.underTest.execute(treeNode1, dependencies);

    // dependency elevator edge
    assertTrue(treeNode3.getEdges().containsKey("depPath_90"));
    assertTrue(treeNode3.getEdges().get("depPath_90").getSourceId()
      .equals(3));
    assertTrue(treeNode3.getEdges().get("depPath_90").getDestinationId()
      .equals(90));
    // flat parent connecting edge
    assertTrue(treeNode2.getEdges().containsKey("depPath_4"));
    assertTrue(treeNode2.getEdges().get("depPath_4").getSourceId()
      .equals(2));
    assertTrue(treeNode2.getEdges().get("depPath_4").getDestinationId()
      .equals(4));
    // dependency elevator edge
    assertTrue(interfaceLeafNode4.getEdges().containsKey("depPath_5"));
    assertTrue(interfaceLeafNode4.getEdges().get("depPath_5").getSourceId()
      .equals(91));
    assertTrue(interfaceLeafNode4.getEdges().get("depPath_5")
      .getDestinationId().equals(5));

    // no edges at all other nodes
    assertTrue(treeNode1.getEdges().isEmpty());
    assertTrue(treeNode4.getEdges().isEmpty());
    assertTrue(treeNode5.getEdges().isEmpty());
    assertTrue(interfaceLeafNode2.getEdges().isEmpty());
  }

  /**
   *      A(1)
   *     /   \
   *    B(2) D(4)
   *   /      \
   * C(3)<----E(5)
   **/
  @Test
  public void testDependenciesHierarchicalEdgeOtherWayAround() {
    final List<SonarDependency> dependencies = new ArrayList<>();

    final SonarDependency fromEtoC = TestTreeBuilder.createDependency(5, 3);
    dependencies.add(fromEtoC);

    final RootTreeNode treeNode1 = new RootTreeNode(1);
    final TreeNode treeNode2 = TestTreeBuilder.createTreeNode(2, treeNode1, 1);
    final TreeNode treeNode3 = TestTreeBuilder.createTreeNode(3, treeNode2, 2);
    final TreeNode treeNode4 = TestTreeBuilder.createTreeNode(4, treeNode1, 1);
    final TreeNode treeNode5 = TestTreeBuilder.createTreeNode(5, treeNode4, 2);

    final TreeNode interfaceLeafNode2 = TestTreeBuilder.createInterfaceLeafNode(90,
      treeNode2);
    final TreeNode interfaceLeafNode4 = TestTreeBuilder.createInterfaceLeafNode(91,
      treeNode4);

    this.underTest.execute(treeNode1, dependencies);

    // dependency elevator edge
    assertTrue(treeNode5.getEdges().get("depPath_91").getSourceId()
      .equals(5));
    assertTrue(treeNode5.getEdges().get("depPath_91").getDestinationId()
      .equals(91));
    // flat parent connecting edge
    assertTrue(treeNode4.getEdges().containsKey("depPath_2"));
    assertTrue(treeNode4.getEdges().get("depPath_2").getSourceId()
      .equals(4));
    assertTrue(treeNode4.getEdges().get("depPath_2").getDestinationId()
      .equals(2));
    // dependency elevator edge
    assertTrue(interfaceLeafNode2.getEdges().containsKey("depPath_3"));
    assertTrue(interfaceLeafNode2.getEdges().get("depPath_3").getSourceId()
      .equals(90));
    assertTrue(interfaceLeafNode2.getEdges().get("depPath_3")
      .getDestinationId().equals(3));

    // no edges at all other nodes
    assertTrue(treeNode1.getEdges().isEmpty());
    assertTrue(treeNode2.getEdges().isEmpty());
    assertTrue(treeNode3.getEdges().isEmpty());
    assertTrue(interfaceLeafNode4.getEdges().isEmpty());
  }

  /**
   *      A(1)
   *     /   \
   *    B(2) D(4)
   *   /      \
   * C(3)<----E(5)
   *     ---->
   **/
  @Test
  public void testDependenciesHierarchicalEdgesBoth() {
    final List<SonarDependency> dependencies = new ArrayList<>();

    final SonarDependency fromCtoE = TestTreeBuilder.createDependency(3, 5);
    dependencies.add(fromCtoE);
    final SonarDependency fromEtoC = TestTreeBuilder.createDependency(5, 3);
    dependencies.add(fromEtoC);

    final RootTreeNode treeNode1 = new RootTreeNode(1);
    final TreeNode treeNode2 = TestTreeBuilder.createTreeNode(2, treeNode1, 1);
    final TreeNode treeNode3 = TestTreeBuilder.createTreeNode(3, treeNode2, 2);
    final TreeNode treeNode4 = TestTreeBuilder.createTreeNode(4, treeNode1, 1);
    final TreeNode treeNode5 = TestTreeBuilder.createTreeNode(5, treeNode4, 2);

    final TreeNode interfaceLeafNode2 = TestTreeBuilder.createInterfaceLeafNode(90,
      treeNode2);
    final TreeNode interfaceLeafNode4 = TestTreeBuilder.createInterfaceLeafNode(91,
      treeNode4);

    this.underTest.execute(treeNode1, dependencies);

    assertTrue(dependencies.contains(fromEtoC));

    // check from c to e

    // dependency elevator edge
    assertTrue(treeNode3.getEdges().containsKey("depPath_90"));
    assertTrue(treeNode3.getEdges().get("depPath_90").getSourceId()
      .equals(3));
    assertTrue(treeNode3.getEdges().get("depPath_90").getDestinationId()
      .equals(90));
    // flat parent connecting edge
    assertTrue(treeNode2.getEdges().containsKey("depPath_4"));
    assertTrue(treeNode2.getEdges().get("depPath_4").getSourceId()
      .equals(2));
    assertTrue(treeNode2.getEdges().get("depPath_4").getDestinationId()
      .equals(4));
    // dependency elevator edge
    assertTrue(interfaceLeafNode4.getEdges().containsKey("depPath_5"));
    assertTrue(interfaceLeafNode4.getEdges().get("depPath_5").getSourceId()
      .equals(91));
    assertTrue(interfaceLeafNode4.getEdges().get("depPath_5")
      .getDestinationId().equals(5));

    // check from e to c

    // dependency elevator edge
    assertTrue(treeNode5.getEdges().containsKey("depPath_91"));
    assertTrue(treeNode5.getEdges().get("depPath_91").getSourceId()
      .equals(5));
    assertTrue(treeNode5.getEdges().get("depPath_91").getDestinationId()
      .equals(91));
    // flat parent connecting edge
    assertTrue(treeNode4.getEdges().containsKey("depPath_2"));
    assertTrue(treeNode4.getEdges().get("depPath_2").getSourceId()
      .equals(4));
    assertTrue(treeNode4.getEdges().get("depPath_2").getDestinationId()
      .equals(2));
    // dependency elevator edge
    assertTrue(interfaceLeafNode2.getEdges().containsKey("depPath_3"));
    assertTrue(interfaceLeafNode2.getEdges().get("depPath_3").getSourceId()
      .equals(90));
    assertTrue(interfaceLeafNode2.getEdges().get("depPath_3")
      .getDestinationId().equals(3));

    // no edges at all other nodes
    assertTrue(treeNode1.getEdges().isEmpty());
  }

  /**
   *      A(1)
   *     /   \
   *    B(2) D(4)
   *   /     >
   *  /     /
   * C(3)--/
   *
   **/
  @Test
  public void testUnevenDependencyEdge() {
    final List<SonarDependency> dependencies = new ArrayList<>();

    final SonarDependency fromCtoE = TestTreeBuilder.createDependency(3, 4);
    dependencies.add(fromCtoE);

    final RootTreeNode treeNode1 = new RootTreeNode(1);
    final TreeNode treeNode2 = TestTreeBuilder.createTreeNode(2, treeNode1, 1);
    final TreeNode treeNode3 = TestTreeBuilder.createTreeNode(3, treeNode2, 2);
    final TreeNode treeNode4 = TestTreeBuilder.createTreeNode(4, treeNode1, 1);

    final TreeNode interfaceLeafNode2 = TestTreeBuilder.createInterfaceLeafNode(90,
      treeNode2);

    this.underTest.execute(treeNode1, dependencies);

    // dependency elevator edge
    assertTrue(treeNode3.getEdges().get("depPath_90").getSourceId()
      .equals(3));
    assertTrue(treeNode3.getEdges().get("depPath_90").getDestinationId()
      .equals(90));
    // flat parent connecting edge
    assertTrue(treeNode2.getEdges().containsKey("depPath_4"));
    assertTrue(treeNode2.getEdges().get("depPath_4").getSourceId()
      .equals(2));
    assertTrue(treeNode2.getEdges().get("depPath_4").getDestinationId()
      .equals(4));

    // no edges at all other nodes
    assertTrue(treeNode1.getEdges().isEmpty());
    assertTrue(treeNode4.getEdges().isEmpty());
    assertTrue(interfaceLeafNode2.getEdges().isEmpty());
  }

}
