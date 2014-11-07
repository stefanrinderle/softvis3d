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
package de.rinderle.softviz3d.domain.tree;

import de.rinderle.softviz3d.dto.SonarSnapshotDTO;
import de.rinderle.softviz3d.preprocessing.tree.OptimizeTreeStructureImpl;
import de.rinderle.softviz3d.preprocessing.tree.PathWalker;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

public class OptimizeTreeStructureTest {

  @Test
  public void testNormalizeWithLongPath() {
    final PathWalker walker = new PathWalker(412);

    this.callWalkerWithMetrics(walker, 413, "src/main/java/de/rinderle/softviz3d");
    this.callWalkerWithMetrics(walker, 414, "src/main/java/de/rinderle/softviz3d/SoftViz3dExtension.java");
    this.callWalkerWithMetrics(walker, 415, "src/main/java/de/rinderle/softviz3d/SoftViz3dPage.java");
    this.callWalkerWithMetrics(walker, 416, "src/main/java/de/rinderle/softviz3d/SoftViz3dPlugin.java");
    this.callWalkerWithMetrics(walker, 417, "src/main/java/de/rinderle/softviz3d/depth");
    this.callWalkerWithMetrics(walker, 418, "src/main/java/de/rinderle/softviz3d/depth/TreeNode.java");
    this.callWalkerWithMetrics(walker, 419, "src/main/java/de/rinderle/softviz3d/depth/PathWalker.java");
    this.callWalkerWithMetrics(walker, 420, "src/main/java/de/rinderle/softviz3d/depth/ResourceTreeService.java");
    this.callWalkerWithMetrics(walker, 421, "src/main/java/de/rinderle/softviz3d/depth/ResourceTreeServiceImpl.java");
    this.callWalkerWithMetrics(walker, 422, "src/main/java/de/rinderle/softviz3d/guice");
    this.callWalkerWithMetrics(walker, 423, "src/main/java/de/rinderle/softviz3d/guice/LayoutVisitorFactory.java");
    this.callWalkerWithMetrics(walker, 424, "src/main/java/de/rinderle/softviz3d/guice/SoftViz3dModule.java");
    this.callWalkerWithMetrics(walker, 457, "src/test");
    this.callWalkerWithMetrics(walker, 457, "src/test/java/de/rinderle/softviz3d");
    this.callWalkerWithMetrics(walker, 458, "src/test/java/de/rinderle/softviz3d/GrappaPointTest.java");
    this.callWalkerWithMetrics(walker, 459, "src/test/java/de/rinderle/softviz3d/TestSource.java");
    this.callWalkerWithMetrics(walker, 460, "src/test/java/de/rinderle/softviz3d/Tree.java");
    this.callWalkerWithMetrics(walker, 461, "src/test/java/de/rinderle/softviz3d/TreePathTest.java");

    final TreeNode tree = walker.getTree();
    assertEquals("children are not main and test", 2, tree.getChildren().get("src").getChildren().size());

    final OptimizeTreeStructureImpl normalizer = new OptimizeTreeStructureImpl();
    normalizer.removeUnnecessaryNodes(tree);

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

  private void callWalkerWithMetrics(final PathWalker walker, final int id, final String path) {
    walker.addPath(new SonarSnapshotDTO(id, path, 1, 1));
  }
}
