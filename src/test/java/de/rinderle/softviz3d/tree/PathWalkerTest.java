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

import de.rinderle.softviz3d.dto.SonarSnapshotDTO;
import org.junit.Test;

import java.util.Map;

import static org.junit.Assert.*;

public class PathWalkerTest {

  @Test
  public void testAddPathSimple() {
    final PathWalker walker = new PathWalker(294);

    this.callWalkerWithMetrics(walker, 401, "src");
    this.callWalkerWithMetrics(walker, 395, "src/in");
    this.callWalkerWithMetrics(walker, 396, "src/in/FirstClass.java");
    this.callWalkerWithMetrics(walker, 397, "src/in/SecondClass.java");
    this.callWalkerWithMetrics(walker, 398, "src/in/ksjbdf");
    this.callWalkerWithMetrics(walker, 399, "src/in/ksjbdf/FithsClass.java");
    this.callWalkerWithMetrics(walker, 400, "src/in/ksjbdf/SixthClass.java");
    this.callWalkerWithMetrics(walker, 402, "src/kjsdfksjdbf.java");
    this.callWalkerWithMetrics(walker, 403, "src/out");
    this.callWalkerWithMetrics(walker, 404, "src/out/A1Class.java");
    this.callWalkerWithMetrics(walker, 405, "src/out/A2Class.java");
    this.callWalkerWithMetrics(walker, 406, "src/out/sdbfsidnf");
    this.callWalkerWithMetrics(walker, 407, "src/out/sdbfsidnf/A4Class.java");
    this.callWalkerWithMetrics(walker, 408, "src/out/sdbfsidnf/A5Class.java");
    this.callWalkerWithMetrics(walker, 409, "src/out/sdbfsidnf/siufb");
    this.callWalkerWithMetrics(walker, 410, "src/out/sdbfsidnf/siufb/A3Class.java");
    this.callWalkerWithMetrics(walker, 411, "src/out/sdbfsidnf/siufb/Asd1Class.java");

    final TreeNode tree = walker.getTree();

    final Map<String, TreeNode> test = tree.getChildren().get("src").getChildren();

    assertEquals("src has 3 children", 3, tree.getChildren().get("src").getChildren().size());
    assertEquals("kjsdfksjdbf.java has no children", 0, tree.getChildren().get("src").getChildren()
      .get("kjsdfksjdbf.java").getChildren().size());

    // check the ids
    assertEquals(Integer.valueOf(401), tree.getChildren().get("src").getId());
    assertEquals(Integer.valueOf(403), tree.getChildren().get("src").getChildren().get("out").getId());
  }

  @Test
  public void testAddPathLongStartPath() {
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
    this.callWalkerWithMetrics(walker, 457, "src/test/java/de/rinderle/softviz3d");
    this.callWalkerWithMetrics(walker, 458, "src/test/java/de/rinderle/softviz3d/GrappaPointTest.java");
    this.callWalkerWithMetrics(walker, 459, "src/test/java/de/rinderle/softviz3d/TestSource.java");
    this.callWalkerWithMetrics(walker, 460, "src/test/java/de/rinderle/softviz3d/Tree.java");
    this.callWalkerWithMetrics(walker, 461, "src/test/java/de/rinderle/softviz3d/TreePathTest.java");

    final TreeNode tree = walker.getTree();

    assertNotNull(tree.getChildren().get("src"));
    assertEquals(2, tree.getChildren().get("src").getChildren().size());

    // check ids
    assertEquals(Integer.valueOf(412), tree.getId());
    // id for source is generated
    assertNotEquals(Integer.valueOf(413), tree.getChildren().get("src").getId());
    assertNotEquals(Integer.valueOf(413), tree.getChildren().get("src").getChildren().get("main").getId());
    assertNotEquals(Integer.valueOf(413),
      tree.getChildren().get("src").getChildren().get("main").getChildren().get("java").getId());
    assertNotEquals(Integer.valueOf(413),
      tree.getChildren().get("src").getChildren().get("main").getChildren().get("java")
        .getChildren().get("de").getChildren().get("rinderle").getId());
    assertEquals(Integer.valueOf(413), tree.getChildren().get("src").getChildren().get("main").getChildren()
      .get("java")
      .getChildren().get("de").getChildren().get("rinderle").getChildren().get("softviz3d").getId());
  }

  @Test
  public void testAddPathShortStartPath() {
    final PathWalker walker = new PathWalker(999999999);

    this.callWalkerWithMetrics(walker, 1, "src/testForSoftViz");
    this.callWalkerWithMetrics(walker, 2, "src/testForSoftViz/FirstClass.java");
    this.callWalkerWithMetrics(walker, 3, "src/testForSoftViz/SecondClass.java");
    this.callWalkerWithMetrics(walker, 4, "src/testForSoftViz/second");
    this.callWalkerWithMetrics(walker, 5, "src/testForSoftViz/second/FourthClass.java");
    this.callWalkerWithMetrics(walker, 6, "src/testForSoftViz/second/ThirdClass.java");
    this.callWalkerWithMetrics(walker, 7, "src/testForSoftViz/second/third");
    this.callWalkerWithMetrics(walker, 8, "src/testForSoftViz/second/third/FithsClass.java");
    this.callWalkerWithMetrics(walker, 9, "src/testForSoftViz/second/third/SixthClass.java");
    this.callWalkerWithMetrics(walker, 10, "src/out");
    this.callWalkerWithMetrics(walker, 11, "src/out/A1Class.java");
    this.callWalkerWithMetrics(walker, 12, "src/out/A2Class.java");
    this.callWalkerWithMetrics(walker, 13, "src/testForSoftViz/forth");
    this.callWalkerWithMetrics(walker, 14, "src/testForSoftViz/forth/FithsClass.java");
    this.callWalkerWithMetrics(walker, 15, "src/testForSoftViz/forth/SixthClass.java");
    this.callWalkerWithMetrics(walker, 16, "src/testForSoftViz/xx");
    this.callWalkerWithMetrics(walker, 17, "src/testForSoftViz/xx/FithsClass.java");
    this.callWalkerWithMetrics(walker, 18, "src/testForSoftViz/xx/SixthClass.java");
    this.callWalkerWithMetrics(walker, 19, "src/testForSoftViz/xx/yy");
    this.callWalkerWithMetrics(walker, 20, "src/testForSoftViz/xx/yy/FithsClass.java");
    this.callWalkerWithMetrics(walker, 21, "src/testForSoftViz/xx/yy/SixthClass.java");

    final TreeNode tree = walker.getTree();

    assertTrue(tree.getChildren().size() == 1);

    final TreeNode sixth =
      tree.getChildren().get("src").getChildren().get("testForSoftViz").getChildren().get("xx").getChildren().get("yy")
        .getChildren().get("SixthClass.java");
    assertNotNull(sixth);

    assertEquals(Integer.valueOf(21), sixth.getId());

    // check the ids
    assertNotEquals(Integer.valueOf(1), tree.getChildren().get("src").getId());
    assertEquals(Integer.valueOf(1), tree.getChildren().get("src").getChildren().get("testForSoftViz").getId());
  }

  private void callWalkerWithMetrics(final PathWalker walker, final int id, final String path) {
    walker.addPath(new SonarSnapshotDTO(id, path, 1, 1));
  }

}
