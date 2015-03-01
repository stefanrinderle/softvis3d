/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.grappa;

import att.grappa.Graph;
import att.grappa.GrappaBox;
import att.grappa.Node;
import de.rinderle.softvis3d.domain.SoftVis3DConstants;
import de.rinderle.softvis3d.domain.graph.ResultPlatform;
import de.rinderle.softvis3d.domain.tree.TreeNodeType;

public class GrappaGraphTestFactory {

	public static ResultPlatform createGraph() {
		final Graph graph = new Graph("root");
		final double x = 0;
		final double y = 0;
		final double width = 50;
		final double height = 50;
		graph.setAttribute("bb", new GrappaBox(x, y, width, height));

		final Node leaf1 = new Node(graphLeaf1());
		leaf1.setAttribute("id", "2");
		leaf1.setAttribute(SoftVis3DConstants.GRAPH_ATTR_BUILDING_HEIGHT, "10");
		leaf1.setAttribute("type", TreeNodeType.TREE.name());
    leaf1.setAttribute(SoftVis3DConstants.SOFTVIZ_COLOR, "#ffffff");
		graph.addNode(leaf1);
		final Node leaf2 = new Node(graphLeaf2());
		leaf2.setAttribute("id", "3");
		leaf2.setAttribute(SoftVis3DConstants.GRAPH_ATTR_BUILDING_HEIGHT, "10");
		leaf2.setAttribute("type", TreeNodeType.TREE.name());
    leaf2.setAttribute(SoftVis3DConstants.SOFTVIZ_COLOR, "#ffffff");
		graph.addNode(leaf2);

		return new ResultPlatform(graph);
	}

	private static Graph graphLeaf1() {
		final Graph graph = new Graph("leaf1");
		final double x = 0;
		final double y = 0;
		final double width = 50;
		final double height = 50;
		graph.setAttribute("bb", new GrappaBox(x, y, width, height));
		return graph;
	}

	private static Graph graphLeaf2() {
		final Graph graph = new Graph("leaf2");
		final double x = 0;
		final double y = 0;
		final double width = 50;
		final double height = 50;
		graph.setAttribute("bb", new GrappaBox(x, y, width, height));
		return graph;
	}

}
