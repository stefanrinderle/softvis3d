package de.rinderle.softviz3d.layout;

import att.grappa.Graph;
import att.grappa.Node;
import de.rinderle.softviz3d.dot.StringOutputStream;

public class GraphDebugPrinter {

	public static String printSimpleGraphLayoutInfos(Graph graph) {
		StringBuilder builder = new StringBuilder();
		builder.append(graph.getId() + " " + graph.getName() + "<br />");
		if (graph.getAttribute("bb") != null) {
			builder.append("bb: " + graph.getAttribute("bb").toString() + "<br />");
		}
		
		for (Node node : graph.nodeElementsAsArray()) {
			builder.append("--" + node.getId() + " " + node.getName()); 
			builder.append(" " + node.getAttribute("pos").toString());
			builder.append(" " + node.getAttribute("height") + " " + node.getAttribute("width") + "<br />");
		}
		
		return builder.toString();
	}
	
	public static String printFullGraph(Graph graph) {
		StringBuilder builder = new StringBuilder();
		StringOutputStream os = new StringOutputStream();
		builder.append("-----------------------<br /><br />");
		graph.printGraph(os);
		builder.append(os.toString());
		builder.append("-----------------------<br /><br />");
		return builder.toString();
	}
	
}
