/**
 * SoftVis3D Sonar plugin
 * Copyright (C) 2016 Stefan Rinderle and Yvo Niedrich
 * stefan@rinderle.info / yvo.niedrich@gmail.com
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
package de.rinderle.softvis3d.preprocessing.tree;

import de.rinderle.softvis3d.domain.sonar.SonarMeasure;
import de.rinderle.softvis3d.domain.tree.TreeNode;

import java.util.Collections;
import java.util.Map;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertSame;

public class PathWalkerTest {

  @Test
  public void testAddPathSimple() {
    final PathWalker walker = new PathWalker("294");

    this.callWalker(walker, "401", "src");
    this.callWalker(walker, "402", "src/in");
    this.callWalker(walker, "403", "src/simpleClass.java");
    this.callWalker(walker, "404", "src/out");

    final TreeNode tree = walker.getTree();

    final TreeNode testNode = tree.getChildren().get("src");
    final Map<String, TreeNode> testChildren = testNode.getChildren();

    // check children
    assertEquals(3, testChildren.size());
    assertEquals(0, testChildren.get("simpleClass.java").getChildren().size());

    // check the ids
    assertEquals("401", testNode.getId());
    assertEquals("404", testChildren.get("out").getId());

    // check the names
    assertEquals("src", testNode.getName());
    assertEquals("out", testChildren.get("out").getName());

    // check the depth
    assertSame(1, testNode.getDepth());
    assertSame(2, testChildren.get("out").getDepth());
  }

  @Test
  public void testAddPathLongStartPath() {
    final PathWalker walker = new PathWalker("412");

    this.callWalker(walker, "413", "src/main/java/de/rinderle/softVis3D");
    this.callWalker(walker, "414", "src/test/java/de/rinderle/softVis3D");

    final TreeNode tree = walker.getTree();

    final TreeNode srcNode = tree.getChildren().get("src");
    final TreeNode mainNode = srcNode.getChildren().get("main");
    final TreeNode rinderleNode =
      mainNode.getChildren().get("java").getChildren().get("de").getChildren().get("rinderle");

    assertNotNull(srcNode);
    assertEquals(2, srcNode.getChildren().size());

    // check ids
    assertEquals("412", tree.getId());

    // id for source is generated
    assertNotEquals("413", srcNode.getId());
    assertNotEquals("413", mainNode.getId());
    assertNotEquals("413", mainNode.getChildren().get("java").getId());
    assertNotEquals("413", rinderleNode.getId());
    assertEquals("413", rinderleNode.getChildren().get("softVis3D").getId());

    // check depth
    assertSame(1, srcNode.getDepth());
    assertSame(2, mainNode.getDepth());
    assertSame(5, rinderleNode.getDepth());
  }

  @Test
  public void testAddPathShortStartPath() {
    final PathWalker walker = new PathWalker("999999999");

    this.callWalker(walker, "1", "src/testForSoftVis");
    this.callWalker(walker, "21", "src/testForSoftVis/xx/yy/SixthClass.java");

    final TreeNode tree = walker.getTree();

    assertSame(1, tree.getChildren().size());

    final TreeNode sixth = tree.getChildren().get("src").getChildren().get("testForSoftVis")
      .getChildren().get("xx").getChildren().get("yy").getChildren().get("SixthClass.java");
    assertNotNull(sixth);

    assertEquals("21", sixth.getId());

    // check the ids
    assertNotEquals("1", tree.getChildren().get("src").getId());
    assertEquals("1", tree.getChildren().get("src").getChildren().get("testForSoftVis").getId());
  }

  private void callWalker(final PathWalker walker, final String id, final String path) {
    final SonarMeasure element = new SonarMeasure(id, id, path, Collections.emptyMap(), null);
    walker.addPath(element);
  }

}
