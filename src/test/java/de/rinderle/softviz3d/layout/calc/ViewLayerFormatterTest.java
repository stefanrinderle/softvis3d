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
package de.rinderle.softviz3d.layout.calc;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import java.awt.Color;

import de.rinderle.softviz3d.grappa.GrappaGraphFactory;
import org.junit.Test;

import att.grappa.Graph;

public class ViewLayerFormatterTest {

    @Test
    public void testFormat() {
        ViewLayerFormatter formatter = new ViewLayerFormatter();
        
        Integer depth = 0;
        Graph graph = GrappaGraphFactory.createGraph();
        formatter.format(graph, depth);
        
        assertNotNull(graph.getAttribute("color"));
        assertNotNull(graph.getAttribute("nodesColor"));
        assertNotNull(graph.getAttribute("transparency"));
    }
    
    @Test
    public void testMaxDepth() {
        ViewLayerFormatter formatter = new ViewLayerFormatter();
        
        Integer depth = Integer.MAX_VALUE;
        Graph graph = GrappaGraphFactory.createGraph();
        formatter.format(graph, depth);
        
        assertNotNull(graph.getAttribute("color"));
        assertNotNull(graph.getAttribute("nodesColor"));
        assertNotNull(graph.getAttribute("transparency"));
        
        Color color = (Color) graph.getAttribute("color").getValue();
        assertTrue(color.getRed() == 254);
    }

}
