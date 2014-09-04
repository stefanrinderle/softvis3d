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
package de.rinderle.softviz3d;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

import de.rinderle.softviz3d.depth.Node;
import de.rinderle.softviz3d.depth.PathWalker;

public class TreePathTest {

    @Test
    public void test() {
        PathWalker walker = new PathWalker(999999999, "/");

        int id = 0;
        
        walker.addPath(id++, "src/testForSoftViz");
        walker.addPath(id++, "src/testForSoftViz/FirstClass.java");
        walker.addPath(id++, "src/testForSoftViz/SecondClass.java");
        walker.addPath(id++, "src/testForSoftViz/second");
        walker.addPath(id++, "src/testForSoftViz/second/FourthClass.java");
        walker.addPath(id++, "src/testForSoftViz/second/ThirdClass.java");
        walker.addPath(id++, "src/testForSoftViz/second/third");
        walker.addPath(id++, "src/testForSoftViz/second/third/FithsClass.java");
        walker.addPath(id++, "src/testForSoftViz/second/third/SixthClass.java");
        walker.addPath(id++, "src/out");
        walker.addPath(id++, "src/out/A1Class.java");
        walker.addPath(id++, "src/out/A2Class.java");
        walker.addPath(id++, "src/testForSoftViz/forth");
        walker.addPath(id++, "src/testForSoftViz/forth/FithsClass.java");
        walker.addPath(id++, "src/testForSoftViz/forth/SixthClass.java");
        walker.addPath(id++, "src/testForSoftViz/xx");
        walker.addPath(id++, "src/testForSoftViz/xx/FithsClass.java");
        walker.addPath(id++, "src/testForSoftViz/xx/SixthClass.java");
        walker.addPath(id++, "src/testForSoftViz/xx/yy");
        walker.addPath(id++, "src/testForSoftViz/xx/yy/FithsClass.java");
        walker.addPath(id, "src/testForSoftViz/xx/yy/SixthClass.java");

        walker.print(System.out);

        Node tree = walker.getTree();

        assertTrue(tree.getChildren().size() == 1);

        // walker.addPath(id++, "src\\testForSoftViz\\xx\\yy\\SixthClass.java");
        Node sixth = tree.getChild("src").getChild("testForSoftViz").getChild("xx")
                .getChild("yy").getChild("SixthClass.java");
        assertNotNull(sixth);
        
        assertEquals(5, sixth.getDepth());
        assertEquals(id, sixth.getId());
    }

    @Test
    public void test2() {
        PathWalker walker = new PathWalker(99999999);

        int id = 0;
        
        walker.addPath(id++, "src\\testForSoftViz");
        walker.addPath(id++, "src\\testForSoftViz\\FirstClass.java");
        walker.addPath(id++, "src\\testForSoftViz\\SecondClass.java");
        walker.addPath(id++, "src\\testForSoftViz\\second");
        walker.addPath(id++, "src\\testForSoftViz\\second\\FourthClass.java");
        walker.addPath(id++, "src\\testForSoftViz\\second\\ThirdClass.java");
        walker.addPath(id++, "src\\testForSoftViz\\second\\third");
        walker.addPath(id++, "src\\testForSoftViz\\second\\third\\FithsClass.java");
        walker.addPath(id++, "src\\testForSoftViz\\second\\third\\SixthClass.java");
        walker.addPath(id++, "src\\out");
        walker.addPath(id++, "src\\out\\A1Class.java");
        walker.addPath(id++, "src\\out\\A2Class.java");
        walker.addPath(id++, "src\\testForSoftViz\\forth");
        walker.addPath(id++, "src\\testForSoftViz\\forth\\FithsClass.java");
        walker.addPath(id++, "src\\testForSoftViz\\forth\\SixthClass.java");
        walker.addPath(id++, "src\\testForSoftViz\\xx");
        walker.addPath(id++, "src\\testForSoftViz\\xx\\FithsClass.java");
        walker.addPath(id++, "src\\testForSoftViz\\xx\\SixthClass.java");
        walker.addPath(id++, "src\\testForSoftViz\\xx\\yy");
        walker.addPath(id++, "src\\testForSoftViz\\xx\\yy\\FithsClass.java");
        walker.addPath(id++, "src\\testForSoftViz\\xx\\yy\\SixthClass.java");

        walker.print(System.out);

        Node tree = walker.getTree();

        assertTrue(tree.getChildren().size() == 1);

        // walker.addPath(id++, "src\\testForSoftViz\\xx\\yy\\SixthClass.java");
        Node sixth = tree.getChild("src").getChild("testForSoftViz").getChild("xx")
                .getChild("yy").getChild("SixthClass.java");
        assertNotNull(sixth);
        
        assertEquals(sixth.getDepth(), 5);
    }

}
