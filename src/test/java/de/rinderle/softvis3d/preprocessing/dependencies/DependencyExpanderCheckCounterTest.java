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
import org.junit.Before;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

/**
 * Checks that the dependency expander creates dependency nodes and does the
 * counting right..
 */
public class DependencyExpanderCheckCounterTest {

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
	 * A(1) / \ B(2)-->C(3) <--
	 *
	 **/
	// @Test
	// public void testDependenciesFlatEdges() {
	// final List<SonarDependencyDTO> dependencies = new
	// ArrayList<SonarDependencyDTO>();
	//
	// final SonarDependencyDTO fromBtoC = this.createDependency(2, 3);
	// dependencies.add(fromBtoC);
	// final SonarDependencyDTO fromCtoB = this.createDependency(3, 2);
	// dependencies.add(fromCtoB);
	//
	// final TreeNode treeNode1 = this.createTreeNode(1, null, 0);
	// final TreeNode treeNode2 = this.createTreeNode(2, treeNode1, 1);
	// final TreeNode treeNode3 = this.createTreeNode(3, treeNode1, 2);
	//
	// this.underTest.execute(MAP_KEY, dependencies);
	//
	// assertTrue(treeNode2.getArrows().containsKey("depPath_2"));
	// assertTrue(treeNode2.getArrows().get("depPath_2").getIncludingDependenciesSize()
	// == 1);
	// assertTrue(treeNode3.getArrows().containsKey("depPath_3"));
	// assertTrue(treeNode3.getArrows().get("depPath_3").getIncludingDependenciesSize()
	// == 1);
	//
	// assertTrue(treeNode1.getArrows().isEmpty());
	// }
	//
	// /**
	// * A(1)
	// * / \
	// * B(2)-->C(3)
	// * -->
	// *
	// **/
	// @Test
	// public void testDependenciesSameFlatEdge() {
	// final List<SonarDependencyDTO> dependencies = new
	// ArrayList<SonarDependencyDTO>();
	//
	// final SonarDependencyDTO fromBtoC = this.createDependency(2, 3);
	// dependencies.add(fromBtoC);
	// dependencies.add(fromBtoC);
	//
	// final TreeNode treeNode1 = this.createTreeNode(1, null, 0);
	// final TreeNode treeNode2 = this.createTreeNode(2, treeNode1, 1);
	// final TreeNode treeNode3 = this.createTreeNode(3, treeNode1, 2);
	//
	// this.underTest.execute(MAP_KEY, dependencies);
	//
	// assertTrue(treeNode2.getArrows().containsKey("depPath_2"));
	// assertTrue(treeNode2.getArrows().get("depPath_2").getIncludingDependenciesSize()
	// == 2);
	//
	// assertTrue(treeNode1.getArrows().isEmpty());
	// assertTrue(treeNode3.getArrows().isEmpty());
	// }
	//
	// /**
	// * A(1)
	// * / \
	// * B(2) D(4)
	// * / > \
	// * / / \
	// * C(3)--/ E(5)
	// * ------->
	// *
	// **/
	// @Test
	// public void testMultipleDependencyEdges() {
	// final List<SonarDependencyDTO> dependencies = new
	// ArrayList<SonarDependencyDTO>();
	//
	// final SonarDependencyDTO fromCtoD = this.createDependency(3, 4);
	// dependencies.add(fromCtoD);
	// final SonarDependencyDTO fromCtoE = this.createDependency(3, 5);
	// dependencies.add(fromCtoE);
	//
	// final TreeNode treeNode1 = this.createTreeNode(1, null, 0);
	// final TreeNode treeNode2 = this.createTreeNode(2, treeNode1, 1);
	// final TreeNode treeNode3 = this.createTreeNode(3, treeNode2, 2);
	// final TreeNode treeNode4 = this.createTreeNode(4, treeNode1, 1);
	// final TreeNode treeNode5 = this.createTreeNode(5, treeNode4, 2);
	//
	// final TreeNode interfaceLeafNode2 = this.createInterfaceLeafNode(90,
	// treeNode2);
	// final TreeNode interfaceLeafNode4 = this.createInterfaceLeafNode(91,
	// treeNode4);
	//
	// this.underTest.execute(MAP_KEY, dependencies);
	//
	// // dependency elevator edge start
	// assertTrue(treeNode3.getArrows().containsKey("depPath_3"));
	// assertTrue(treeNode3.getArrows().get("depPath_3").getIncludingDependenciesSize()
	// == 2);
	// // flat edge
	// assertTrue(treeNode2.getArrows().containsKey("depPath_2"));
	// assertTrue(treeNode2.getArrows().get("depPath_2").getIncludingDependenciesSize()
	// == 2);
	// // dependency elevator edge end
	// assertTrue(interfaceLeafNode4.getArrows().containsKey("depPath_5"));
	// assertTrue(interfaceLeafNode4.getArrows().get("depPath_5").getIncludingDependenciesSize()
	// == 1);
	//
	// assertTrue(treeNode5.getArrows().isEmpty());
	// assertTrue(interfaceLeafNode2.getArrows().isEmpty());
	// }
	//
	// private TreeNode createTreeNode(final int id, final TreeNode parent,
	// final int depth) {
	// final TreeNode result = new TreeNode(id, parent, depth,
	// TreeNodeType.TREE, id + "", 0, 0);
	//
	// when(this.treeService.findNode(MAP_KEY, id)).thenReturn(result);
	//
	// return result;
	// }
	//
	// // resourceTreeService.findInterfaceLeafNode(LayoutViewType.DEPENDENCY,
	// projectId, intLeafLabel);
	// private TreeNode createInterfaceLeafNode(final int id, final TreeNode
	// parent) {
	// final TreeNode result = new TreeNode(id, parent, 0,
	// TreeNodeType.DEPENDENCY_GENERATED, id + "", 0, 0);
	//
	// final String intLeafLabel = DependencyExpanderBean.INTERFACE_PREFIX + "_"
	// + parent.getId();
	// when(this.treeService.findInterfaceLeafNode(MAP_KEY, intLeafLabel))
	// .thenReturn(result);
	//
	// return result;
	// }
	//
	// private SonarDependencyDTO createDependency(final int from, final int to)
	// {
	// final SonarDependencyDTO result = new SonarDependencyDTO();
	//
	// result.setFromSnapshotId(from);
	// result.setToSnapshotId(to);
	//
	// return result;
	// }

}
