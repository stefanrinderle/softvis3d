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

import java.util.Map;
import java.util.TreeMap;


public class TreeNode {
    private final int depth;
    private Integer id;
    private TreeNodeType type;
    private TreeNode parent;
    private double heightMetricValue;
    private double footprintMetricValue;
    private String name;

    private final Map<String, TreeNode> children = new TreeMap<String, TreeNode>();

    public TreeNode(Integer id, TreeNode parent, int depth, TreeNodeType type, String name, double heightMetricValue, double footprintMetricValue) {
        this.id = id;
        this.parent = parent;
        this.depth = depth;
        this.name = name;
        this.type = type;
        this.heightMetricValue = heightMetricValue;
        this.footprintMetricValue = footprintMetricValue;
    }

    public TreeNode getChild(String name) {
        if (children.containsKey(name)) {
            return children.get(name);
        } else {
            return null;
        }
    }

    public TreeNode getOrCreateChild(int id, String name, TreeNodeType type, double heightMetricValue, double footprintMetricValue) {
        if (children.containsKey(name)) {
            return children.get(name);
        }

        TreeNode result = new TreeNode(id, this, this.depth + 1, type, name, heightMetricValue, footprintMetricValue);
        children.put(name, result);
        return result;
    }

    public Map<String, TreeNode> getChildren() {
        return children;
    }

    public Integer getId() {
        return id;
    }

    public TreeNode getParent() {
        return parent;
    }

    public Integer getDepth() {
        return depth;
    }

    public TreeNodeType getType() {
        return type;
    }

    public double getHeightMetricValue() {
        return heightMetricValue;
    }

    public double getFootprintMetricValue() {
        return footprintMetricValue;
    }

    public String getName() {
        return name;
    }
}