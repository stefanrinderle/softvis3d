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
package de.rinderle.softviz3d.grappa;

import att.grappa.Graph;
import att.grappa.GrappaBox;
import att.grappa.Node;

public class TestGraphHelper {

    public static Graph graphRoot() {
        Graph graph = new Graph("root");
        double x = 0;
        double y = 0;
        double width = 50;
        double height = 50;
        graph.setAttribute("bb", new GrappaBox(x, y, width, height));

        Node leaf1 = new Node(graphLeaf1());
        leaf1.setAttribute("id", "2");
        leaf1.setAttribute("buildingHeight", "10");
        graph.addNode(leaf1);
        Node leaf2 = new Node(graphLeaf2());
        leaf2.setAttribute("id", "3");
        leaf2.setAttribute("buildingHeight", "10");
        graph.addNode(leaf2);

        return graph;
    }

    public static Graph graphLeaf1() {
        Graph graph = new Graph("leaf1");
        double x = 0;
        double y = 0;
        double width = 50;
        double height = 50;
        graph.setAttribute("bb", new GrappaBox(x, y, width, height));
        return graph;
    }

    public static Graph graphLeaf2() {
        Graph graph = new Graph("leaf2");
        double x = 0;
        double y = 0;
        double width = 50;
        double height = 50;
        graph.setAttribute("bb", new GrappaBox(x, y, width, height));
        return graph;
    }
}
