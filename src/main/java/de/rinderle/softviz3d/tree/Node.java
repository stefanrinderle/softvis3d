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

import java.util.Collections;
import java.util.Map;
import java.util.TreeMap;

public class Node {
    private final int depth;
    private int id;
    private Node parent;

    private final Map<String, Node> children = new TreeMap<String, Node>();

    public Node(int id, Node parent, int depth) {
        this.id = id;
        this.parent = parent;
        this.depth = depth;
    }

    public Node getChild(String name) {
        if (children.containsKey(name)) {
            return children.get(name);
        } else {
            return null;
        }
    }

    public Node getOrCreateChild(int id, String name) {
        if (children.containsKey(name)) {
            return children.get(name);
        }

        Node result = new Node(id, this, this.depth + 1);
        children.put(name, result);
        return result;
    }

    public Map<String, Node> getChildren() {
        return Collections.unmodifiableMap(children);
    }

    public int getId() {
        return id;
    }

    public Node getParent() {
        return parent;
    }

    public Integer getDepth() {
        return depth;
    }
}