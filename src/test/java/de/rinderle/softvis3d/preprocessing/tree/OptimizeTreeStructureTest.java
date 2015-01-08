/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.preprocessing.tree;

import de.rinderle.softvis3d.domain.sonar.SonarSnapshot;
import de.rinderle.softvis3d.domain.tree.TreeNode;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

public class OptimizeTreeStructureTest {

	@Test
	public void testNormalizeWithLongPath() {
		final PathWalker walker = new PathWalker(412);

		this.callWalkerWithMetrics(walker, 413,
				"src/main/java/de/rinderle/softVis3D");
		this.callWalkerWithMetrics(walker, 414,
				"src/main/java/de/rinderle/softVis3D/softVis3DExtension.java");
		this.callWalkerWithMetrics(walker, 415,
				"src/main/java/de/rinderle/softVis3D/softVis3DPage.java");
		this.callWalkerWithMetrics(walker, 416,
				"src/main/java/de/rinderle/softVis3D/softVis3DPlugin.java");
		this.callWalkerWithMetrics(walker, 417,
				"src/main/java/de/rinderle/softVis3D/depth");
		this.callWalkerWithMetrics(walker, 418,
				"src/main/java/de/rinderle/softVis3D/depth/TreeNode.java");
		this.callWalkerWithMetrics(walker, 419,
				"src/main/java/de/rinderle/softVis3D/depth/PathWalker.java");
		this.callWalkerWithMetrics(walker, 420,
				"src/main/java/de/rinderle/softVis3D/depth/ResourceTreeService.java");
		this.callWalkerWithMetrics(walker, 421,
				"src/main/java/de/rinderle/softVis3D/depth/ResourceTreeServiceImpl.java");
		this.callWalkerWithMetrics(walker, 422,
				"src/main/java/de/rinderle/softVis3D/guice");
		this.callWalkerWithMetrics(walker, 423,
				"src/main/java/de/rinderle/softVis3D/guice/LayoutVisitorFactory.java");
		this.callWalkerWithMetrics(walker, 424,
				"src/main/java/de/rinderle/softVis3D/guice/softVis3DModule.java");
		this.callWalkerWithMetrics(walker, 457, "src/test");
		this.callWalkerWithMetrics(walker, 457,
				"src/test/java/de/rinderle/softVis3D");
		this.callWalkerWithMetrics(walker, 458,
				"src/test/java/de/rinderle/softVis3D/GrappaPointTest.java");
		this.callWalkerWithMetrics(walker, 459,
				"src/test/java/de/rinderle/softVis3D/TestSource.java");
		this.callWalkerWithMetrics(walker, 460,
				"src/test/java/de/rinderle/softVis3D/Tree.java");
		this.callWalkerWithMetrics(walker, 461,
				"src/test/java/de/rinderle/softVis3D/TreePathTest.java");

		final TreeNode tree = walker.getTree();
		assertEquals("children are not main and test", 2, tree.getChildren()
				.get("src").getChildren().size());

		final OptimizeTreeStructureImpl normalizer = new OptimizeTreeStructureImpl();
		normalizer.removeUnnecessaryNodes(tree);

		assertEquals("children of src are not main and test", 2, tree
				.getChildren().get("src").getChildren().size());
		assertNotNull(
				"next child after main is not softVis3D",
				tree.getChildren().get("src").getChildren()
						.get("main/java/de/rinderle/softVis3D"));
		assertEquals(
				"depth is not right",
				Integer.valueOf(2),
				tree.getChildren().get("src").getChildren()
						.get("main/java/de/rinderle/softVis3D").getDepth());
		assertNotNull(
				"next child after main is not softVis3D",
				tree.getChildren().get("src").getChildren()
						.get("test/java/de/rinderle/softVis3D"));
		assertEquals(
				"depth is not right",
				Integer.valueOf(2),
				tree.getChildren().get("src").getChildren()
						.get("test/java/de/rinderle/softVis3D").getDepth());

		assertEquals(
				"depth is not right",
				Integer.valueOf(3),
				tree.getChildren().get("src").getChildren()
						.get("main/java/de/rinderle/softVis3D").getChildren()
						.get("guice").getDepth());
	}

	private void callWalkerWithMetrics(final PathWalker walker, final int id,
			final String path) {
		walker.addPath(new SonarSnapshot(id, path, 1, 1));
	}
}
