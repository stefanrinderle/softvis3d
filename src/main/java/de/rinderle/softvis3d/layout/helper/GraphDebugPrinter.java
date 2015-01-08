/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.layout.helper;

import att.grappa.Graph;
import att.grappa.Node;

import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;

import static att.grappa.GrappaConstants.*;

public class GraphDebugPrinter {

	private static final String BREAK_STRING = "-----------------------<br /><br />";

	private String printSimpleGraphLayoutInfos(final Graph graph) {
		final StringBuilder builder = new StringBuilder();
		builder.append(graph.getId() + " " + graph.getName() + "\n");
		if (graph.getAttribute("bb") != null) {
			builder.append("bb: " + graph.getAttribute("bb").toString() + "\n");
		}

		for (final Node node : graph.nodeElementsAsArray()) {
			builder.append("--" + node.getId() + " " + node.getName());
			builder.append(" " + node.getAttribute(POS_ATTR).toString());
			builder.append(" " + node.getAttribute(HEIGHT_ATTR) + " "
					+ node.getAttribute(WIDTH_ATTR) + "\n");
		}

		return builder.toString();
	}

	public String printFullGraph(final Graph graph) {
		final StringBuilder builder = new StringBuilder();
		final StringOutputStream os = new StringOutputStream();
		builder.append("-----------------------\n\n");
		graph.printGraph(os);
		builder.append(os.toString());
		builder.append("-----------------------\n\n");
		return builder.toString();
	}

	public void printGraphsWithAbsolutePosition(final StringBuilder builder,
			final Map<Integer, Graph> resultGraphs) {
		Iterator<Entry<Integer, Graph>> iterator = resultGraphs.entrySet()
				.iterator();
		builder.append("-------Result graphs with absolute position--------<br /><br />");
		Entry<Integer, Graph> graph;
		while (iterator.hasNext()) {
			graph = iterator.next();
			final StringOutputStream os = new StringOutputStream();
			graph.getValue().printGraph(os);
			builder.append(os.toString());
		}

		builder.append(BREAK_STRING);
		builder.append(BREAK_STRING);
	}

	public void printGraphsWithoutAbsolutePosition(final StringBuilder builder,
			final Map<Integer, Graph> resultGraphs) {
		builder.append("-------Result graphs without absolute position--------<br /><br />");
		final Iterator<Entry<Integer, Graph>> iterator = resultGraphs
				.entrySet().iterator();
		Entry<Integer, Graph> graph;
		while (iterator.hasNext()) {
			graph = iterator.next();
			builder.append(this.printSimpleGraphLayoutInfos(graph.getValue()));
		}
		builder.append(BREAK_STRING);
		builder.append(BREAK_STRING);
	}
}
