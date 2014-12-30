/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.preprocessing.dependencies;

import de.rinderle.softvis3d.cache.SnapshotCacheService;
import de.rinderle.softvis3d.domain.sonar.SonarDependency;
import de.rinderle.softvis3d.domain.tree.RootTreeNode;
import de.rinderle.softvis3d.domain.tree.TreeNode;
import de.rinderle.softvis3d.domain.tree.TreeNodeType;
import de.rinderle.softvis3d.domain.tree.ValueTreeNode;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertTrue;

public class DependencyExpanderTest {

  private static final String MAP_KEY = "1";

  @Mock
  private SnapshotCacheService treeService;

  @InjectMocks
  private final DependencyExpanderBean underTest = new DependencyExpanderBean();

  @Before
  public void setUp() {
    MockitoAnnotations.initMocks(this);
  }

  /**
   * A(1)
   * /    \
   * B(2)-->C(3)
   * <--
   */
  @Test
  public void testDependenciesFlatEdges() {
    final List<SonarDependency> dependencies = new ArrayList<SonarDependency>();

    final SonarDependency fromBtoC = this.createDependency("1000", 2, 3);
    dependencies.add(fromBtoC);

    final RootTreeNode rootTreeNode = new RootTreeNode(1);
    final TreeNode treeNode2 = this.createTreeNode(2, rootTreeNode, 1);
    final TreeNode treeNode3 = this.createTreeNode(3, rootTreeNode, 2);

    rootTreeNode.getChildren().put("2", treeNode2);
    rootTreeNode.getChildren().put("3", treeNode3);

    this.underTest.execute(rootTreeNode, dependencies);

    assertTrue(treeNode2.getEdges().containsKey("depPath_3"));
    assertTrue(treeNode2.getEdges().get("depPath_3").getIncludingDependenciesSize() == 1);

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

    final SonarDependency fromBtoC1 = this.createDependency("1002", 2, 3);
    final SonarDependency fromBtoC2 = this.createDependency("1003", 2, 3);
    dependencies.add(fromBtoC1);
    dependencies.add(fromBtoC2);

    final RootTreeNode rootTreeNode = new RootTreeNode(1);
    final TreeNode treeNode2 = this.createTreeNode(2, rootTreeNode, 1);
    final TreeNode treeNode3 = this.createTreeNode(3, rootTreeNode, 2);

    rootTreeNode.getChildren().put("2", treeNode2);
    rootTreeNode.getChildren().put("3", treeNode3);

    this.underTest.execute(rootTreeNode, dependencies);

    assertTrue(treeNode2.getEdges().containsKey("depPath_3"));
    assertTrue(treeNode2.getEdges().get("depPath_3").getIncludingDependenciesSize() == 2);

    assertTrue(rootTreeNode.getEdges().isEmpty());
    assertTrue(treeNode3.getEdges().isEmpty());
  }

  //
//  /**
//  * A(1)
//  * / \
//  * B(2) D(4)
//  * / > \
//  * / / \
//  * C(3)--/ E(5)
//  * ------->
//  *
//  **/
//  @Test
//  public void testMultipleDependencyEdges() {
//  final List<SonarDependencyDTO> dependencies = new ArrayList<SonarDependencyDTO>();
//
//  final SonarDependencyDTO fromCtoD = this.createDependency(3, 4);
//  dependencies.add(fromCtoD);
//  final SonarDependencyDTO fromCtoE = this.createDependency(3, 5);
//  dependencies.add(fromCtoE);
//
//  final TreeNode treeNode1 = this.createTreeNode(1, null, 0);
//  final TreeNode treeNode2 = this.createTreeNode(2, treeNode1, 1);
//  final TreeNode treeNode3 = this.createTreeNode(3, treeNode2, 2);
//  final TreeNode treeNode4 = this.createTreeNode(4, treeNode1, 1);
//  final TreeNode treeNode5 = this.createTreeNode(5, treeNode4, 2);
//
//  final TreeNode interfaceLeafNode2 = this.createInterfaceLeafNode(90, treeNode2);
//  final TreeNode interfaceLeafNode4 = this.createInterfaceLeafNode(91, treeNode4);
//
//  this.underTest.execute(MAP_KEY, dependencies);
//
//  // dependency elevator edge start
//  assertTrue(treeNode3.getArrows().containsKey("depPath_3"));
//  assertTrue(treeNode3.getArrows().get("depPath_3").getIncludingDependenciesSize() == 2);
//  // flat edge
//  assertTrue(treeNode2.getArrows().containsKey("depPath_2"));
//  assertTrue(treeNode2.getArrows().get("depPath_2").getIncludingDependenciesSize() == 2);
//  // dependency elevator edge end
//  assertTrue(interfaceLeafNode4.getArrows().containsKey("depPath_5"));
//  assertTrue(interfaceLeafNode4.getArrows().get("depPath_5").getIncludingDependenciesSize() == 1);
//
//  assertTrue(treeNode5.getArrows().isEmpty());
//  assertTrue(interfaceLeafNode2.getArrows().isEmpty());
//  }
//
  private TreeNode createTreeNode(final int id, final TreeNode parent, final int depth) {
    final TreeNode result = new ValueTreeNode(id, parent, depth, TreeNodeType.TREE, id + "", 0, 0);

//    when(this.treeService.findNode(MAP_KEY, id)).thenReturn(result);

    return result;
  }
//
//  // resourceTreeService.findInterfaceLeafNode(LayoutViewType.DEPENDENCY, projectId, intLeafLabel);
//  private TreeNode createInterfaceLeafNode(final int id, final TreeNode parent) {
//  final TreeNode result = new TreeNode(id, parent, 0, TreeNodeType.DEPENDENCY_GENERATED, id + "", 0, 0);
//
//  final String intLeafLabel = DependencyExpanderBean.INTERFACE_PREFIX + "_" + parent.getId();
//  when(this.treeService.findInterfaceLeafNode(MAP_KEY, intLeafLabel))
//  .thenReturn(result);
//
//  return result;
//  }

  private SonarDependency createDependency(final String dependencyId, final int from, final int to) {
    final SonarDependency result = new SonarDependency();

    result.setId(new BigInteger(dependencyId));
    result.setFromSnapshotId(from);
    result.setToSnapshotId(to);

    return result;
  }

}
