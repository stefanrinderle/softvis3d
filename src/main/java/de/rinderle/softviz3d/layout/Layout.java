package de.rinderle.softviz3d.layout;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import att.grappa.Graph;
import att.grappa.Node;
import de.rinderle.softviz3d.dot.DotExcecutorException;
import de.rinderle.softviz3d.helper.GraphDebugPrinter;
import de.rinderle.softviz3d.layout.interfaces.SourceObject;
import de.rinderle.softviz3d.layout.model.LayeredLayoutElement;

public class Layout {

//	private static final Logger LOGGER = LoggerFactory
//			.getLogger(Layout.class);
	
	private LayoutVisitor visitor;
	
	public String startLayout(SourceObject source) throws DotExcecutorException {
		// STEP 1 ---
		this.visitor = new LayoutVisitor();
		
		// last output element could be used to start absolutepositioncalc
		LayeredLayoutElement root = this.accept(source);
		Map<Integer, Graph> resultGraphs = this.visitor.getResultingGraphList();
		// ----------
		
		// debug output
		StringBuilder builder = new StringBuilder();
		
		builder.append("-------Result graphs without absolute position--------<br /><br />");
		Iterator<Entry<Integer, Graph>> iterator = resultGraphs.entrySet().iterator();
		Entry<Integer, Graph> graph;
		while (iterator.hasNext()) {
			graph = iterator.next();
			builder.append(GraphDebugPrinter.printSimpleGraphLayoutInfos(graph.getValue()));
		}
		builder.append("-----------------------<br /><br />");
		
		// NEXT STEP HERE
		AbsolutePositionCalculator calc = new AbsolutePositionCalculator(resultGraphs);
		List<Node> nodes = calc.calculate(source);
		// ---
		
		builder.append("-------Result graphs with absolute position--------<br /><br />");
		iterator = resultGraphs.entrySet().iterator();
		while (iterator.hasNext()) {
			graph = iterator.next();
			builder.append(GraphDebugPrinter.printSimpleGraphLayoutInfos(graph.getValue()));
		}
		
		builder.append("-----------------------<br /><br />");
		builder.append("-----------------------<br /><br />");
		builder.append("-----------------------<br /><br />");
		
		Graph test = new Graph("bal");
		for (Node node : nodes) {
			test.addNode(node);
		}
		
		builder.append("-------Graph out of node list- FULL -------<br /><br />");
		builder.append(GraphDebugPrinter.printFullGraph(test));
		builder.append("-------Graph out of node list--------<br /><br />");
		builder.append(GraphDebugPrinter.printSimpleGraphLayoutInfos(test));
		
		return builder.toString();
	}
	
	private LayeredLayoutElement accept(SourceObject source) throws DotExcecutorException {
		ArrayList<LayeredLayoutElement> layerElements = new ArrayList<LayeredLayoutElement>();
		
		List<? extends SourceObject> childrenNodes = source.getChildrenNodes();
		for (SourceObject node : childrenNodes) {
			layerElements.add(this.accept(node));
		}
		
		List<? extends SourceObject> childrenLeaves = source.getChildrenLeaves();
		for (SourceObject leaf : childrenLeaves) {
			layerElements.add(visitor.visitFile(leaf));
		}		
		
		LayeredLayoutElement layer = visitor.visitDir(source, layerElements);
		
		return layer;
	}

}
