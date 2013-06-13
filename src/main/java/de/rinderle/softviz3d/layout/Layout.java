package de.rinderle.softviz3d.layout;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sonar.api.database.model.Snapshot;
import org.sonar.api.resources.Scopes;

import att.grappa.Graph;

import de.rinderle.softviz3d.dao.SnapshotDao;
import de.rinderle.softviz3d.dot.DotExcecutorException;
import de.rinderle.softviz3d.dot.StringOutputStream;
import de.rinderle.softviz3d.layout.model.InputElement;
import att.grappa.Node;

public class Layout {

	private static final Logger LOGGER = LoggerFactory
			.getLogger(Layout.class);
	
	private SnapshotDao dao;
	private LayoutVisitor visitor;
	
	public Layout(SnapshotDao dao) {
		this.dao = dao;
	}
	
	public String startLayout(Integer snapshotId) throws DotExcecutorException {
		this.visitor = new LayoutVisitor();
		
		InputElement root = this.accept(dao.getSnapshotById(snapshotId));
		
		LOGGER.info(dao.getChildrenIds(snapshotId).toString());
		LOGGER.info("root element is " + root.toString());
		
		Map<Integer, Graph> resultGraphs = this.visitor.getResultingGraphList();
		
		StringBuilder builder = new StringBuilder();
		
		Iterator<Entry<Integer, Graph>> iterator = resultGraphs.entrySet().iterator();
		Entry<Integer, Graph> graph;
		while (iterator.hasNext()) {
			graph = iterator.next();
			StringOutputStream os = new StringOutputStream();
			builder.append("-----------------------<br /><br />");
			graph.getValue().printGraph(os);
			builder.append(os.toString());
			builder.append("-----------------------<br /><br />");
		}
		builder.append("-----------------------<br /><br />");
		
		AbsolutePositionCalculator calc = new AbsolutePositionCalculator(dao, resultGraphs);
		List<Node> nodes = calc.calculate(snapshotId);
		
		builder.append("--Nodes" + nodes.size() + "---------------------<br />");
		for (Node node : nodes) {
			builder.append(node.toString() + " - " + node.getAttributeValue("pos").toString());
		}
		builder.append("-----------------------<br /><br />");
		builder.append("-----------------------<br /><br />");
		
		iterator = resultGraphs.entrySet().iterator();
		while (iterator.hasNext()) {
			graph = iterator.next();
			StringOutputStream os = new StringOutputStream();
			builder.append("-----------------------<br /><br />");
			graph.getValue().printGraph(os);
			builder.append(os.toString());
			builder.append("-----------------------<br /><br />");
		}
		
		builder.append("-----------------------<br /><br />");
		builder.append("-----------------------<br /><br />");
		builder.append("-----------------------<br /><br />");
		
		Graph test = new Graph("bal");
		for (Node node : nodes) {
			test.addNode(node);
		}
		
		StringOutputStream osTest = new StringOutputStream();
		test.printGraph(osTest);
		builder.append(osTest);
		
		return builder.toString();
	}
	
	public InputElement startLayoutGetInputElement(Integer snapshotId) throws DotExcecutorException {
		this.visitor = new LayoutVisitor();
		
		return this.accept(dao.getSnapshotById(snapshotId));
	}
	
	private InputElement accept(Snapshot snapshot) throws DotExcecutorException {
		ArrayList<InputElement> layerElements = new ArrayList<InputElement>();
		
		List<Snapshot> childrenDirs = dao.getChildrenByScope(snapshot.getId(), Scopes.DIRECTORY);
		for (Snapshot dir : childrenDirs) {
			LOGGER.info("layout dir " + dir.getId());
			layerElements.add(this.accept(dir));
		}
		
		List<Snapshot> childrenFiles = dao.getChildrenByScope(snapshot.getId(), Scopes.FILE);
		for (Snapshot file : childrenFiles) {
			LOGGER.info("layout file " + file.getId());
			layerElements.add(visitor.visitFile(file));
		}		
		
		InputElement layer = visitor.visitDir(snapshot, layerElements);
		
		return layer;
	}

}
