package de.rinderle.softviz3d.helper;

import att.grappa.Graph;
import att.grappa.Node;

public class GraphDebugPrinter {

	public static String printSimpleGraphLayoutInfos(Graph graph) {
		StringBuilder builder = new StringBuilder();
		builder.append(graph.getId() + " " + graph.getName() + "\n");
		if (graph.getAttribute("bb") != null) {
			builder.append("bb: " + graph.getAttribute("bb").toString() + "\n");
		}
		
		for (Node node : graph.nodeElementsAsArray()) {
			builder.append("--" + node.getId() + " " + node.getName()); 
			builder.append(" " + node.getAttribute("pos").toString());
			builder.append(" " + node.getAttribute("height") + " " + node.getAttribute("width") + "\n");
		}

		return builder.toString();
	}
	
	public static String printFullGraph(Graph graph) {
		StringBuilder builder = new StringBuilder();
		StringOutputStream os = new StringOutputStream();
		builder.append("-----------------------\n\n");
		graph.printGraph(os);
		builder.append(os.toString());
		builder.append("-----------------------\n\n");
		return builder.toString();
	}
	
}
