/*
 * softvis3d-base
 * Copyright (C) 2015 Stefan Rinderle
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
package de.rinderle.softvis3d.base.layout.dot;

import java.util.ArrayList;
import java.util.List;
import org.apache.commons.lang.StringUtils;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;

/**
 * Windows: "\"C:\\Program Files (x86)\\graphviz\\bin\\dot\"";
 */
public class GraphvizPathTest {

    private static final String INPUT_TEST_1 = "D:/x_sri/graphviz/bin/dot";
    private static final String INPUT_TEST_2 = "D:\\x_sri\\graphviz\\bin\\dot";
    private static final String INPUT_TEST_3 = "D:/x_sri\\graphviz/bin\\dot";
    private static final String INPUT_TEST_4 = "D:\\x_sri/graphviz\\bin/dot";
    private static final String INPUT_TEST_5 = "C:\\Program Files (x86)\\graphviz\\bin\\dot";
    private static final String INPUT_TEST_6 = "D:/x_sri/graphviz/bin/dot";
    private static final String INPUT_TEST_7 = "/usr/bin/dot";
    private static final String INPUT_TEST_8 = "\\usr\\bin\\dot";
    private static final String INPUT_TEST_9 = "\\usr/bin\\dot";
    private static final String INPUT_TEST_10 = "\\usr\\bin/dot";
    private static final String INPUT_TEST_11 = "\\usr\\bin/dot";
    private static final String INPUT_TEST_12 = "/usr/bi n/dot";

    /**
     * Unix: forward slashes
     */
    @Test
    public void testGetDotExecutableUnix() throws Exception {
        final boolean isWindows = false;

        final List<String> pathList = createMapFor(isWindows);

        for(String value : pathList) {
            final GraphvizPath path = new GraphvizPath(value, isWindows);
            final String result = path.getDotExecutable();

            assertNotNull(result);
            assertFalse(StringUtils.isBlank(result));
            assertEquals(result, -1, result.indexOf("\\"));
        }
    }

    /**
     * Windows: backslashes
     */
    @Test
    public void testGetDotExecutableWindows() throws Exception {
        final boolean isWindows = true;

        final List<String> pathList = createMapFor(isWindows);

        for(String value : pathList) {
            final GraphvizPath path = new GraphvizPath(value, isWindows);
            final String result = path.getDotExecutable();

            assertNotNull(result);
            assertFalse(StringUtils.isBlank(result));
            assertEquals(-1, result.indexOf("/"));
        }
    }

    /**
     * Windows: escaping
     */
    @Test
    public void testGetDotExecutableWindowsEscape() throws Exception {
        final boolean isWindows = true;

        final GraphvizPath path = new GraphvizPath(INPUT_TEST_2, isWindows);
        final String result = path.getDotExecutable();

        assertNotNull(result);
        assertFalse(StringUtils.isBlank(result));
        assertEquals("\"" + INPUT_TEST_2 + "\"", result);
    }

    /**
     * Windows: escaping
     */
    @Test
    public void testGetDotExecutableWindowsEscape2() throws Exception {
        final boolean isWindows = true;

        final GraphvizPath path = new GraphvizPath(INPUT_TEST_5, isWindows);
        final String result = path.getDotExecutable();

        assertNotNull(result);
        assertFalse(StringUtils.isBlank(result));
        assertEquals("\"" + INPUT_TEST_5 + "\"", result);
    }

    /**
     * Windows: escaping
     */
    @Test
    public void testGetGvprExecutableWindowsEscape() throws Exception {
        final boolean isWindows = true;

        final GraphvizPath path = new GraphvizPath(INPUT_TEST_2, isWindows);
        final String result = path.getGvprExecutable();

        assertNotNull(result);
        assertFalse(StringUtils.isBlank(result));
        assertEquals("\"D:\\x_sri\\graphviz\\bin\\gvpr\"", result);
    }

    /**
     * Windows: escaping
     */
    @Test
    public void testGetGvprExecutableWindowsEscape2() throws Exception {
        final boolean isWindows = true;

        final GraphvizPath path = new GraphvizPath(INPUT_TEST_5, isWindows);
        final String result = path.getGvprExecutable();

        assertNotNull(result);
        assertFalse(StringUtils.isBlank(result));
        assertEquals("\"C:\\Program Files (x86)\\graphviz\\bin\\gvpr\"", result);
    }

    /**
     * Unix: do t --> do\ t
     */
    @Test
    public void testGetDotExecutableUnixWhitespace() throws Exception {
        final boolean isWindows = false;

        final GraphvizPath path = new GraphvizPath(INPUT_TEST_12, isWindows);
        final String result = path.getDotExecutable();

        assertNotNull(result);
        assertFalse(StringUtils.isBlank(result));
        assertEquals("/usr/bi\\ n/dot", result);
    }

    private List<String> createMapFor(final boolean isWindows) {
        List<String> result = new ArrayList<>();
        result.add(INPUT_TEST_1);
        result.add(INPUT_TEST_2);
        result.add(INPUT_TEST_3);
        result.add(INPUT_TEST_4);
        if (isWindows) {
            result.add(INPUT_TEST_5);
        }
        result.add(INPUT_TEST_6);
        result.add(INPUT_TEST_7);
        result.add(INPUT_TEST_8);
        result.add(INPUT_TEST_9);
        result.add(INPUT_TEST_10);
        result.add(INPUT_TEST_11);
        if (isWindows) {
            result.add(INPUT_TEST_12);
        }
        return result;
    }
}