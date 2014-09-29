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

import static org.junit.Assert.*;

public class TreePathTest {

    @Test
    public void test() {
        PathWalker walker = new PathWalker(294);

        walker.addPath(401, "src");
        walker.addPath(395, "src/in");
        walker.addPath(396, "src/in/FirstClass.java");
        walker.addPath(397, "src/in/SecondClass.java");
        walker.addPath(398, "src/in/ksjbdf");
        walker.addPath(399, "src/in/ksjbdf/FithsClass.java");
        walker.addPath(400, "src/in/ksjbdf/SixthClass.java");
        walker.addPath(402, "src/kjsdfksjdbf.java");
        walker.addPath(403, "src/out");
        walker.addPath(404, "src/out/A1Class.java");
        walker.addPath(405, "src/out/A2Class.java");
        walker.addPath(406, "src/out/sdbfsidnf");
        walker.addPath(407, "src/out/sdbfsidnf/A4Class.java");
        walker.addPath(408, "src/out/sdbfsidnf/A5Class.java");
        walker.addPath(409, "src/out/sdbfsidnf/siufb");
        walker.addPath(410, "src/out/sdbfsidnf/siufb/A3Class.java");
        walker.addPath(411, "src/out/sdbfsidnf/siufb/Asd1Class.java");

        TreeNode tree = walker.getTree();

        assertEquals("src has 3 children", tree.getChild("src").getChildren()
                .size(), 3);
        assertEquals("kjsdfksjdbf.java has no children", tree.getChild("src")
                .getChild("kjsdfksjdbf.java").getChildren().size(), 0);

        // check the ids
        assertEquals(401, tree.getChild("src").getId());
        assertEquals(403, tree.getChild("src").getChild("out").getId());
    }

    @Test
    public void testLongStartPath() {
        PathWalker walker = new PathWalker(412);

        walker.addPath(413, "src/main/java/de/rinderle/softviz3d");
        walker.addPath(414, "src/main/java/de/rinderle/softviz3d/SoftViz3dExtension.java");
        walker.addPath(415, "src/main/java/de/rinderle/softviz3d/SoftViz3dPage.java");
        walker.addPath(416, "src/main/java/de/rinderle/softviz3d/SoftViz3dPlugin.java");
        walker.addPath(417, "src/main/java/de/rinderle/softviz3d/depth");
        walker.addPath(418, "src/main/java/de/rinderle/softviz3d/depth/TreeNode.java");
        walker.addPath(419, "src/main/java/de/rinderle/softviz3d/depth/PathWalker.java");
        walker.addPath(420, "src/main/java/de/rinderle/softviz3d/depth/ResourceTreeService.java");
        walker.addPath(421, "src/main/java/de/rinderle/softviz3d/depth/ResourceTreeServiceImpl.java");
        walker.addPath(422, "src/main/java/de/rinderle/softviz3d/guice");
        walker.addPath(423, "src/main/java/de/rinderle/softviz3d/guice/LayoutVisitorFactory.java");
        walker.addPath(424, "src/main/java/de/rinderle/softviz3d/guice/SoftViz3dModule.java");
        walker.addPath(457, "src/test/java/de/rinderle/softviz3d");
        walker.addPath(458, "src/test/java/de/rinderle/softviz3d/GrappaPointTest.java");
        walker.addPath(459, "src/test/java/de/rinderle/softviz3d/TestSource.java");
        walker.addPath(460, "src/test/java/de/rinderle/softviz3d/Tree.java");
        walker.addPath(461, "src/test/java/de/rinderle/softviz3d/TreePathTest.java");

        TreeNode tree = walker.getTree();

        assertNotNull(tree.getChild("src"));
        assertEquals(2, tree.getChild("src").getChildren().size());

        // check ids
        assertEquals(412, tree.getId());
        // id for source is generated
        assertNotEquals(413, tree.getChild("src").getId());
        assertNotEquals(413, tree.getChild("src").getChild("main").getId());
        assertNotEquals(413, tree.getChild("src").getChild("main").getChild("java").getId());
        assertNotEquals(413, tree.getChild("src").getChild("main").getChild("java")
                .getChild("de").getChild("rinderle").getId());
        assertEquals(413, tree.getChild("src").getChild("main").getChild("java")
                .getChild("de").getChild("rinderle").getChild("softviz3d").getId());
    }

    @Test
    public void test1() {
        PathWalker walker = new PathWalker(999999999);

        walker.addPath(1, "src/testForSoftViz");
        walker.addPath(2, "src/testForSoftViz/FirstClass.java");
        walker.addPath(3, "src/testForSoftViz/SecondClass.java");
        walker.addPath(4, "src/testForSoftViz/second");
        walker.addPath(5, "src/testForSoftViz/second/FourthClass.java");
        walker.addPath(6, "src/testForSoftViz/second/ThirdClass.java");
        walker.addPath(7, "src/testForSoftViz/second/third");
        walker.addPath(8, "src/testForSoftViz/second/third/FithsClass.java");
        walker.addPath(9, "src/testForSoftViz/second/third/SixthClass.java");
        walker.addPath(10, "src/out");
        walker.addPath(11, "src/out/A1Class.java");
        walker.addPath(12, "src/out/A2Class.java");
        walker.addPath(13, "src/testForSoftViz/forth");
        walker.addPath(14, "src/testForSoftViz/forth/FithsClass.java");
        walker.addPath(15, "src/testForSoftViz/forth/SixthClass.java");
        walker.addPath(16, "src/testForSoftViz/xx");
        walker.addPath(17, "src/testForSoftViz/xx/FithsClass.java");
        walker.addPath(18, "src/testForSoftViz/xx/SixthClass.java");
        walker.addPath(19, "src/testForSoftViz/xx/yy");
        walker.addPath(20, "src/testForSoftViz/xx/yy/FithsClass.java");
        walker.addPath(21, "src/testForSoftViz/xx/yy/SixthClass.java");

        TreeNode tree = walker.getTree();

        assertTrue(tree.getChildren().size() == 1);

        TreeNode sixth =
                tree.getChild("src").getChild("testForSoftViz").getChild("xx").getChild("yy").getChild("SixthClass.java");
        assertNotNull(sixth);

        assertEquals(21, sixth.getId());

        // check the ids
        assertNotEquals(1, tree.getChild("src").getId());
        assertEquals(1, tree.getChild("src").getChild("testForSoftViz").getId());
    }

}
