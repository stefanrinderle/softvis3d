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

import de.rinderle.softviz3d.layout.calc.Edge;

import java.util.HashMap;
import java.util.Map;
import java.util.TreeMap;


public class TreeNode {
    private int depth;
    private Integer id;
    private TreeNodeType type;
    private TreeNode parent;
    private double heightMetricValue;
    private double footprintMetricValue;
    private String name;

    private Map<String, TreeNode> children = new TreeMap<String, TreeNode>();
    private Map<String, Edge> edges = new HashMap<String, Edge>();

    public TreeNode(Integer id, TreeNode parent, int depth, TreeNodeType type, String name, double footprintMetricValue, double heightMetricValue) {
        this.id = id;
        this.parent = parent;
        this.depth = depth;
        this.name = name;
        this.type = type;
        this.footprintMetricValue = footprintMetricValue;
        this.heightMetricValue = heightMetricValue;
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

    public void setEdge(Edge outEdge) {
        this.edges.put(outEdge.getDepEdgeLabel(), outEdge);
    }

    public boolean hasEdge(String edgeLabel)  {
        return this.edges.containsKey(edgeLabel);
    }

    public Edge getEdge(String depEdgeLabel) {
        return this.edges.get(depEdgeLabel);
    }

    public Map<String, Edge> getEdges() {
        return edges;
    }

    public void setParent(TreeNode parent) {
        this.parent = parent;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setChildren(Map<String, TreeNode> children) {
        this.children = children;
    }

    public void setDepth(Integer depth) {
        this.depth = depth;
    }
}