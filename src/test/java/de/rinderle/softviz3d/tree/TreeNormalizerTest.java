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
package de.rinderle.softviz3d.tree;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

public class TreeNormalizerTest {

  @Test
  public void testNormalizeWithLongPath() {
    PathWalker walker = new PathWalker(412);

    callWalkerWithMetrics(walker, 413, "src/main/java/de/rinderle/softviz3d");
    callWalkerWithMetrics(walker, 414, "src/main/java/de/rinderle/softviz3d/SoftViz3dExtension.java");
    callWalkerWithMetrics(walker, 415, "src/main/java/de/rinderle/softviz3d/SoftViz3dPage.java");
    callWalkerWithMetrics(walker, 416, "src/main/java/de/rinderle/softviz3d/SoftViz3dPlugin.java");
    callWalkerWithMetrics(walker, 417, "src/main/java/de/rinderle/softviz3d/depth");
    callWalkerWithMetrics(walker, 418, "src/main/java/de/rinderle/softviz3d/depth/TreeNode.java");
    callWalkerWithMetrics(walker, 419, "src/main/java/de/rinderle/softviz3d/depth/PathWalker.java");
    callWalkerWithMetrics(walker, 420, "src/main/java/de/rinderle/softviz3d/depth/ResourceTreeService.java");
    callWalkerWithMetrics(walker, 421, "src/main/java/de/rinderle/softviz3d/depth/ResourceTreeServiceImpl.java");
    callWalkerWithMetrics(walker, 422, "src/main/java/de/rinderle/softviz3d/guice");
    callWalkerWithMetrics(walker, 423, "src/main/java/de/rinderle/softviz3d/guice/LayoutVisitorFactory.java");
    callWalkerWithMetrics(walker, 424, "src/main/java/de/rinderle/softviz3d/guice/SoftViz3dModule.java");
    callWalkerWithMetrics(walker, 457, "src/test");
    callWalkerWithMetrics(walker, 457, "src/test/java/de/rinderle/softviz3d");
    callWalkerWithMetrics(walker, 458, "src/test/java/de/rinderle/softviz3d/GrappaPointTest.java");
    callWalkerWithMetrics(walker, 459, "src/test/java/de/rinderle/softviz3d/TestSource.java");
    callWalkerWithMetrics(walker, 460, "src/test/java/de/rinderle/softviz3d/Tree.java");
    callWalkerWithMetrics(walker, 461, "src/test/java/de/rinderle/softviz3d/TreePathTest.java");

    TreeNode tree = walker.getTree();
    assertEquals("children are not main and test", 2, tree.getChildren().get("src").getChildren().size());

    TreeNormalizer normalizer = new TreeNormalizer();
    normalizer.normalizeTree(tree);
    normalizer.recalculateDepth(tree);

    assertEquals("children of src are not main and test", 2, tree.getChildren().get("src").getChildren().size());
    assertNotNull("next child after main is not softviz3d", tree.getChildren().get("src").getChildren()
      .get("main/java/de/rinderle/softviz3d"));
    assertEquals("depth is not right", Integer.valueOf(2), tree.getChildren().get("src").getChildren()
      .get("main/java/de/rinderle/softviz3d").getDepth());
    assertNotNull("next child after main is not softviz3d", tree.getChildren().get("src").getChildren()
      .get("test/java/de/rinderle/softviz3d"));
    assertEquals("depth is not right", Integer.valueOf(2), tree.getChildren().get("src").getChildren()
      .get("test/java/de/rinderle/softviz3d").getDepth());

    assertEquals("depth is not right", Integer.valueOf(3), tree.getChildren().get("src").getChildren()
      .get("main/java/de/rinderle/softviz3d").getChildren().get("guice").getDepth());
  }

  private void callWalkerWithMetrics(PathWalker walker, int id, String path) {
    walker.addPath(id, path, 1, 1);
  }
}
