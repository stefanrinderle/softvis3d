/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.preprocessing.dependencies;

import de.rinderle.softvis3d.cache.SnapshotCacheService;
import de.rinderle.softvis3d.domain.sonar.SonarDependency;
import de.rinderle.softvis3d.domain.sonar.SonarDependencyBuilder;
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

	@Mock
	private SnapshotCacheService treeService;

	@InjectMocks
	private final DependencyExpanderBean underTest = new DependencyExpanderBean();

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

		final SonarDependency fromBtoC = this.createDependency("1000", 2, 3);
		dependencies.add(fromBtoC);

		final RootTreeNode rootTreeNode = new RootTreeNode(1);
		final TreeNode treeNode2 = this.createTreeNode(2, rootTreeNode, 1);
		final TreeNode treeNode3 = this.createTreeNode(3, rootTreeNode, 2);

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

		final SonarDependency fromBtoC1 = this.createDependency("1002", 2, 3);
		final SonarDependency fromBtoC2 = this.createDependency("1003", 2, 3);
		dependencies.add(fromBtoC1);
		dependencies.add(fromBtoC2);

		final RootTreeNode rootTreeNode = new RootTreeNode(1);
		final TreeNode treeNode2 = this.createTreeNode(2, rootTreeNode, 1);
		final TreeNode treeNode3 = this.createTreeNode(3, rootTreeNode, 2);

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

		final SonarDependency fromCtoE = this.createDependency("1000", 3, 5);
		dependencies.add(fromCtoE);

		final RootTreeNode rootTreeNode = new RootTreeNode(1);
		final TreeNode treeNode2 = this.createTreeNode(2, rootTreeNode, 1);
		final TreeNode treeNode4 = this.createTreeNode(4, rootTreeNode, 1);

		final TreeNode treeNode3 = this.createTreeNode(3, treeNode2, 2);
		final TreeNode treeNode5 = this.createTreeNode(5, treeNode4, 2);

		this.underTest.execute(rootTreeNode, dependencies);

		// dependency elevator edge start
		assertTrue(treeNode3.getEdges().size() == 1);
		assertTrue(treeNode2.getEdges().size() == 1);
		assertTrue(treeNode5.getEdges().isEmpty());
	}

	private TreeNode createTreeNode(final int id, final TreeNode parent,
			final int depth) {

    TreeNode node = new ValueTreeNode(id, parent, depth,
            TreeNodeType.TREE, id + "", 0, 0, 0);
    parent.getChildren().put(node.getName(), node);

    return node;
	}

  private SonarDependency createDependency(final String dependencyId, final int from, final int to) {
    final SonarDependencyBuilder result = new SonarDependencyBuilder();

    result.withId(new BigInteger(dependencyId));
    result.withFromSnapshotId(from);
    result.withToSnapshotId(to);

    return result.createSonarDependency();
  }


}
