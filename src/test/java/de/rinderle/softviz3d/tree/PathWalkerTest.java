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

import java.util.Map;

import static org.junit.Assert.*;

public class PathWalkerTest {

    @Test
    public void testAddPathSimple() {
        PathWalker walker = new PathWalker(294);

        callWalkerWithMetrics(walker, 401, "src");
        callWalkerWithMetrics(walker, 395, "src/in");
        callWalkerWithMetrics(walker, 396, "src/in/FirstClass.java");
        callWalkerWithMetrics(walker, 397, "src/in/SecondClass.java");
        callWalkerWithMetrics(walker, 398, "src/in/ksjbdf");
        callWalkerWithMetrics(walker, 399, "src/in/ksjbdf/FithsClass.java");
        callWalkerWithMetrics(walker, 400, "src/in/ksjbdf/SixthClass.java");
        callWalkerWithMetrics(walker, 402, "src/kjsdfksjdbf.java");
        callWalkerWithMetrics(walker, 403, "src/out");
        callWalkerWithMetrics(walker, 404, "src/out/A1Class.java");
        callWalkerWithMetrics(walker, 405, "src/out/A2Class.java");
        callWalkerWithMetrics(walker, 406, "src/out/sdbfsidnf");
        callWalkerWithMetrics(walker, 407, "src/out/sdbfsidnf/A4Class.java");
        callWalkerWithMetrics(walker, 408, "src/out/sdbfsidnf/A5Class.java");
        callWalkerWithMetrics(walker, 409, "src/out/sdbfsidnf/siufb");
        callWalkerWithMetrics(walker, 410, "src/out/sdbfsidnf/siufb/A3Class.java");
        callWalkerWithMetrics(walker, 411, "src/out/sdbfsidnf/siufb/Asd1Class.java");

        TreeNode tree = walker.getTree();

        Map<String, TreeNode> test = tree.getChildren().get("src").getChildren();

        assertEquals("src has 3 children", 3, tree.getChildren().get("src").getChildren().size());
        assertEquals("kjsdfksjdbf.java has no children", 0, tree.getChildren().get("src").getChildren()
                .get("kjsdfksjdbf.java").getChildren().size());

        // check the ids
        assertEquals(Integer.valueOf(401), tree.getChildren().get("src").getId());
        assertEquals(Integer.valueOf(403), tree.getChildren().get("src").getChildren().get("out").getId());
    }

    @Test
    public void testAddPathLongStartPath() {
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
        callWalkerWithMetrics(walker, 457, "src/test/java/de/rinderle/softviz3d");
        callWalkerWithMetrics(walker, 458, "src/test/java/de/rinderle/softviz3d/GrappaPointTest.java");
        callWalkerWithMetrics(walker, 459, "src/test/java/de/rinderle/softviz3d/TestSource.java");
        callWalkerWithMetrics(walker, 460, "src/test/java/de/rinderle/softviz3d/Tree.java");
        callWalkerWithMetrics(walker, 461, "src/test/java/de/rinderle/softviz3d/TreePathTest.java");

        TreeNode tree = walker.getTree();

        assertNotNull(tree.getChildren().get("src"));
        assertEquals(2, tree.getChildren().get("src").getChildren().size());

        // check ids
        assertEquals(Integer.valueOf(412), tree.getId());
        // id for source is generated
        assertNotEquals(Integer.valueOf(413), tree.getChildren().get("src").getId());
        assertNotEquals(Integer.valueOf(413), tree.getChildren().get("src").getChildren().get("main").getId());
        assertNotEquals(Integer.valueOf(413), tree.getChildren().get("src").getChildren().get("main").getChildren().get("java").getId());
        assertNotEquals(Integer.valueOf(413), tree.getChildren().get("src").getChildren().get("main").getChildren().get("java")
                .getChildren().get("de").getChildren().get("rinderle").getId());
        assertEquals(Integer.valueOf(413), tree.getChildren().get("src").getChildren().get("main").getChildren().get("java")
                .getChildren().get("de").getChildren().get("rinderle").getChildren().get("softviz3d").getId());
    }

    @Test
    public void testAddPathShortStartPath() {
        PathWalker walker = new PathWalker(999999999);

        callWalkerWithMetrics(walker, 1, "src/testForSoftViz");
        callWalkerWithMetrics(walker, 2, "src/testForSoftViz/FirstClass.java");
        callWalkerWithMetrics(walker, 3, "src/testForSoftViz/SecondClass.java");
        callWalkerWithMetrics(walker, 4, "src/testForSoftViz/second");
        callWalkerWithMetrics(walker, 5, "src/testForSoftViz/second/FourthClass.java");
        callWalkerWithMetrics(walker, 6, "src/testForSoftViz/second/ThirdClass.java");
        callWalkerWithMetrics(walker, 7, "src/testForSoftViz/second/third");
        callWalkerWithMetrics(walker, 8, "src/testForSoftViz/second/third/FithsClass.java");
        callWalkerWithMetrics(walker, 9, "src/testForSoftViz/second/third/SixthClass.java");
        callWalkerWithMetrics(walker, 10, "src/out");
        callWalkerWithMetrics(walker, 11, "src/out/A1Class.java");
        callWalkerWithMetrics(walker, 12, "src/out/A2Class.java");
        callWalkerWithMetrics(walker, 13, "src/testForSoftViz/forth");
        callWalkerWithMetrics(walker, 14, "src/testForSoftViz/forth/FithsClass.java");
        callWalkerWithMetrics(walker, 15, "src/testForSoftViz/forth/SixthClass.java");
        callWalkerWithMetrics(walker, 16, "src/testForSoftViz/xx");
        callWalkerWithMetrics(walker, 17, "src/testForSoftViz/xx/FithsClass.java");
        callWalkerWithMetrics(walker, 18, "src/testForSoftViz/xx/SixthClass.java");
        callWalkerWithMetrics(walker, 19, "src/testForSoftViz/xx/yy");
        callWalkerWithMetrics(walker, 20, "src/testForSoftViz/xx/yy/FithsClass.java");
        callWalkerWithMetrics(walker, 21, "src/testForSoftViz/xx/yy/SixthClass.java");

        TreeNode tree = walker.getTree();

        assertTrue(tree.getChildren().size() == 1);

        TreeNode sixth =
                tree.getChildren().get("src").getChildren().get("testForSoftViz").getChildren().get("xx").getChildren().get("yy").getChildren().get("SixthClass.java");
        assertNotNull(sixth);

        assertEquals(Integer.valueOf(21), sixth.getId());

        // check the ids
        assertNotEquals(Integer.valueOf(1), tree.getChildren().get("src").getId());
        assertEquals(Integer.valueOf(1), tree.getChildren().get("src").getChildren().get("testForSoftViz").getId());
    }

    private void callWalkerWithMetrics(PathWalker walker, int id, String path) {
        walker.addPath(id, path, 1, 1);
    }

}
