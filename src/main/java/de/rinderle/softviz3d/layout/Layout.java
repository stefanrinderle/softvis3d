package de.rinderle.softviz3d.layout;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import att.grappa.Graph;
import de.rinderle.softviz3d.dot.DotExcecutorException;
import de.rinderle.softviz3d.helper.GraphDebugPrinter;
import de.rinderle.softviz3d.helper.StringOutputStream;
import de.rinderle.softviz3d.layout.interfaces.SourceObject;
import de.rinderle.softviz3d.layout.model.LayeredLayoutElement;

public class Layout {

	 private static final Logger LOGGER = LoggerFactory
	 .getLogger(Layout.class);

	private LayoutVisitor visitor;

	public Layout(LayoutVisitor visitor) {
		this.visitor = visitor;
	}

	public Map<Integer, Graph> startLayout(SourceObject source) throws DotExcecutorException {
		// STEP 1 ---

		// last output element could be used to start absolutepositioncalc
		this.accept(source);
		Map<Integer, Graph> resultGraphs = this.visitor.getResultingGraphList();
		// ----------

		// debug output
		StringBuilder builder = new StringBuilder();
		printGraphsWithoutAbsolutePosition(builder, resultGraphs);

		startAbsolutePositioning(source, resultGraphs, builder);
		
		printGraphsWithAbsolutePosition(builder, resultGraphs);
		
		LOGGER.info(builder.toString());
		
		return resultGraphs;
	}
	
	private Map<Integer, Graph> startAbsolutePositioning(SourceObject source,
			Map<Integer, Graph> resultGraphs, StringBuilder builder) {
		// NEXT STEP HERE
		AbsolutePositionCalculator calc = new AbsolutePositionCalculator(resultGraphs);
		calc.calculate(source);
		// ---

		// debug result graphs after positioning graphs
		printGraphsWithAbsolutePosition(builder, resultGraphs);

		return resultGraphs;
	}

	/**
	 * Bottom up calculation of layout layers.
	 * 
	 * Public because of unit testing access.
	 */
	public LayeredLayoutElement accept(SourceObject source)
			throws DotExcecutorException {
		ArrayList<LayeredLayoutElement> layerElements = new ArrayList<LayeredLayoutElement>();

		List<? extends SourceObject> childrenNodes = source.getChildrenNodes();
		for (SourceObject node : childrenNodes) {
			layerElements.add(this.accept(node));
		}

		List<? extends SourceObject> childrenLeaves = source
				.getChildrenLeaves();
		for (SourceObject leaf : childrenLeaves) {
			layerElements.add(visitor.visitFile(leaf));
		}

		LayeredLayoutElement layer = visitor.visitDir(source, layerElements);

		return layer;
	}

	private void printGraphsWithAbsolutePosition(StringBuilder builder,
			Map<Integer, Graph> resultGraphs) {
		Iterator<Entry<Integer, Graph>> iterator = resultGraphs.entrySet()
				.iterator();
		builder.append("-------Result graphs with absolute position--------<br /><br />");
		iterator = resultGraphs.entrySet().iterator();
		Entry<Integer, Graph> graph;
		while (iterator.hasNext()) {
			graph = iterator.next();
			StringOutputStream os = new StringOutputStream();
			builder.append(os.toString());
		}
		
		builder.append("-----------------------<br /><br />");
		builder.append("-----------------------<br /><br />");
	}

	private void printGraphsWithoutAbsolutePosition(StringBuilder builder,
			Map<Integer, Graph> resultGraphs) {
		builder.append("-------Result graphs without absolute position--------<br /><br />");
		Iterator<Entry<Integer, Graph>> iterator = resultGraphs.entrySet()
				.iterator();
		Entry<Integer, Graph> graph;
		while (iterator.hasNext()) {
			graph = iterator.next();
			builder.append(GraphDebugPrinter.printSimpleGraphLayoutInfos(graph
					.getValue()));
		}
		builder.append("-----------------------<br /><br />");
		builder.append("-----------------------<br /><br />");
	}

}
