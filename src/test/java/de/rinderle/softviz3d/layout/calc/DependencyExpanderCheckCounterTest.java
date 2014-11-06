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
package de.rinderle.softviz3d.layout.calc;

import de.rinderle.softviz3d.dto.SonarDependencyDTO;
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

import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.when;

/**
 * Checks that the dependency expander creates dependency
 * nodes and does the counting right..
 */
public class DependencyExpanderCheckCounterTest {

  private static final String MAP_KEY = "1";

  @Mock
  private ResourceTreeService treeService;

  @InjectMocks
  private final DependencyExpanderImpl underTest = new DependencyExpanderImpl();

  @Before
  public void setUp() {
    MockitoAnnotations.initMocks(this);
  }

  /**
   *      A(1)
   *     /   \
   *   B(2)-->C(3)
   *       <--
   *
   **/
  @Test
  public void testDependenciesFlatEdges() {
    final List<SonarDependencyDTO> dependencies = new ArrayList<SonarDependencyDTO>();

    final SonarDependencyDTO fromBtoC = this.createDependency(2, 3);
    dependencies.add(fromBtoC);
    final SonarDependencyDTO fromCtoB = this.createDependency(3, 2);
    dependencies.add(fromCtoB);

    final TreeNode treeNode1 = this.createTreeNode(1, null, 0);
    final TreeNode treeNode2 = this.createTreeNode(2, treeNode1, 1);
    final TreeNode treeNode3 = this.createTreeNode(3, treeNode1, 2);

    this.underTest.execute(MAP_KEY, dependencies);

    assertTrue(treeNode2.getEdges().containsKey("depPath_2"));
    assertTrue(treeNode2.getEdges().get("depPath_2").getCounter() == 1);
    assertTrue(treeNode3.getEdges().containsKey("depPath_3"));
    assertTrue(treeNode3.getEdges().get("depPath_3").getCounter() == 1);

    assertTrue(treeNode1.getEdges().isEmpty());
  }

  /**
   *      A(1)
   *     /   \
   *   B(2)-->C(3)
   *       -->
   *
   **/
  @Test
  public void testDependenciesSameFlatEdge() {
    final List<SonarDependencyDTO> dependencies = new ArrayList<SonarDependencyDTO>();

    final SonarDependencyDTO fromBtoC = this.createDependency(2, 3);
    dependencies.add(fromBtoC);
    dependencies.add(fromBtoC);

    final TreeNode treeNode1 = this.createTreeNode(1, null, 0);
    final TreeNode treeNode2 = this.createTreeNode(2, treeNode1, 1);
    final TreeNode treeNode3 = this.createTreeNode(3, treeNode1, 2);

    this.underTest.execute(MAP_KEY, dependencies);

    assertTrue(treeNode2.getEdges().containsKey("depPath_2"));
    assertTrue(treeNode2.getEdges().get("depPath_2").getCounter() == 2);

    assertTrue(treeNode1.getEdges().isEmpty());
    assertTrue(treeNode3.getEdges().isEmpty());
  }

  /**
   *      A(1)
   *     /   \
   *    B(2) D(4)
   *   /     > \
   *  /     /   \
   * C(3)--/     E(5)
   *     ------->
   *
   **/
  @Test
  public void testMultipleDependencyEdges() {
    final List<SonarDependencyDTO> dependencies = new ArrayList<SonarDependencyDTO>();

    final SonarDependencyDTO fromCtoD = this.createDependency(3, 4);
    dependencies.add(fromCtoD);
    final SonarDependencyDTO fromCtoE = this.createDependency(3, 5);
    dependencies.add(fromCtoE);

    final TreeNode treeNode1 = this.createTreeNode(1, null, 0);
    final TreeNode treeNode2 = this.createTreeNode(2, treeNode1, 1);
    final TreeNode treeNode3 = this.createTreeNode(3, treeNode2, 2);
    final TreeNode treeNode4 = this.createTreeNode(4, treeNode1, 1);
    final TreeNode treeNode5 = this.createTreeNode(5, treeNode4, 2);

    final TreeNode interfaceLeafNode2 = this.createInterfaceLeafNode(90, treeNode2);
    final TreeNode interfaceLeafNode4 = this.createInterfaceLeafNode(91, treeNode4);

    this.underTest.execute(MAP_KEY, dependencies);

    // dependency elevator edge start
    assertTrue(treeNode3.getEdges().containsKey("depPath_3"));
    assertTrue(treeNode3.getEdges().get("depPath_3").getCounter() == 2);
    // flat edge
    assertTrue(treeNode2.getEdges().containsKey("depPath_2"));
    assertTrue(treeNode2.getEdges().get("depPath_2").getCounter() == 2);
    // dependency elevator edge end
    assertTrue(interfaceLeafNode4.getEdges().containsKey("depPath_5"));
    assertTrue(interfaceLeafNode4.getEdges().get("depPath_5").getCounter() == 1);

    assertTrue(treeNode5.getEdges().isEmpty());
    assertTrue(interfaceLeafNode2.getEdges().isEmpty());
  }

  private TreeNode createTreeNode(final int id, final TreeNode parent, final int depth) {
    final TreeNode result = new TreeNode(id, parent, depth, TreeNodeType.TREE, id + "", 0, 0);

    when(this.treeService.findNode(MAP_KEY, id)).thenReturn(result);

    return result;
  }

  // resourceTreeService.findInterfaceLeafNode(LayoutViewType.DEPENDENCY, projectId, intLeafLabel);
  private TreeNode createInterfaceLeafNode(final int id, final TreeNode parent) {
    final TreeNode result = new TreeNode(id, parent, 0, TreeNodeType.DEPENDENCY_GENERATED, id + "", 0, 0);

    final String intLeafLabel = DependencyExpanderImpl.INTERFACE_PREFIX + "_" + parent.getId();
    when(this.treeService.findInterfaceLeafNode(MAP_KEY, intLeafLabel))
      .thenReturn(result);

    return result;
  }

  private SonarDependencyDTO createDependency(final int from, final int to) {
    final SonarDependencyDTO result = new SonarDependencyDTO();

    result.setFromSnapshotId(from);
    result.setToSnapshotId(to);

    return result;
  }

}
