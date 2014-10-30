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

import de.rinderle.softviz3d.sonar.SonarDependency;
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

  private static final Integer PROJECT_ID = 1;

  @Mock
  private ResourceTreeService treeService;

  @InjectMocks
  private DependencyExpanderImpl underTest = new DependencyExpanderImpl();

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
    List<SonarDependency> dependencies = new ArrayList<SonarDependency>();

    SonarDependency fromBtoC = createDependency(2, 3);
    dependencies.add(fromBtoC);
    SonarDependency fromCtoB = createDependency(3, 2);
    dependencies.add(fromCtoB);

    TreeNode treeNode1 = createTreeNode(1, null, 0);
    TreeNode treeNode2 = createTreeNode(2, treeNode1, 1);
    TreeNode treeNode3 = createTreeNode(3, treeNode1, 2);

    underTest.execute(PROJECT_ID, dependencies);

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
        List<SonarDependency> dependencies = new ArrayList<SonarDependency>();

        SonarDependency fromBtoC = createDependency(2, 3);
        dependencies.add(fromBtoC);
        dependencies.add(fromBtoC);

        TreeNode treeNode1 = createTreeNode(1, null, 0);
        TreeNode treeNode2 = createTreeNode(2, treeNode1, 1);
        TreeNode treeNode3 = createTreeNode(3, treeNode1, 2);

        underTest.execute(PROJECT_ID, dependencies);

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
        List<SonarDependency> dependencies = new ArrayList<SonarDependency>();

        SonarDependency fromCtoD = createDependency(3, 4);
        dependencies.add(fromCtoD);
        SonarDependency fromCtoE = createDependency(3, 5);
        dependencies.add(fromCtoE);

        TreeNode treeNode1 = createTreeNode(1, null, 0);
        TreeNode treeNode2 = createTreeNode(2, treeNode1, 1);
        TreeNode treeNode3 = createTreeNode(3, treeNode2, 2);
        TreeNode treeNode4 = createTreeNode(4, treeNode1, 1);
        TreeNode treeNode5 = createTreeNode(5, treeNode4, 2);

        TreeNode interfaceLeafNode2 = createInterfaceLeafNode(90, treeNode2);
        TreeNode interfaceLeafNode4 = createInterfaceLeafNode(91, treeNode4);

        underTest.execute(PROJECT_ID, dependencies);

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


  private TreeNode createTreeNode(int id, TreeNode parent, int depth) {
    TreeNode result = new TreeNode(id, parent, depth, TreeNodeType.TREE, id + "", 0, 0);

    when(treeService.findNode(LayoutViewType.DEPENDENCY, PROJECT_ID, id)).thenReturn(result);

    return result;
  }

  // resourceTreeService.findInterfaceLeafNode(LayoutViewType.DEPENDENCY, projectId, intLeafLabel);
  private TreeNode createInterfaceLeafNode(int id, TreeNode parent) {
    TreeNode result = new TreeNode(id, parent, 0, TreeNodeType.DEPENDENCY_GENERATED, id + "", 0, 0);

    String intLeafLabel = DependencyExpanderImpl.INTERFACE_PREFIX + "_" + parent.getId();
    when(treeService.findInterfaceLeafNode(LayoutViewType.DEPENDENCY, PROJECT_ID, intLeafLabel))
      .thenReturn(result);

    return result;
  }

  private SonarDependency createDependency(int from, int to) {
    SonarDependency result = new SonarDependency();

    result.setFromSnapshotId(from);
    result.setToSnapshotId(to);

    return result;
  }

}
