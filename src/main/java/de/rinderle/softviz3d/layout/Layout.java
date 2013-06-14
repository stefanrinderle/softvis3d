package de.rinderle.softviz3d.layout;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.sonar.api.database.model.Snapshot;
import org.sonar.api.resources.Scopes;

import att.grappa.Graph;
import att.grappa.Node;
import de.rinderle.softviz3d.dao.SnapshotDao;
import de.rinderle.softviz3d.dot.DotExcecutorException;
import de.rinderle.softviz3d.dot.StringOutputStream;
import de.rinderle.softviz3d.layout.model.InputElement;

public class Layout {

//	private static final Logger LOGGER = LoggerFactory
//			.getLogger(Layout.class);
	
	private SnapshotDao dao;
	private LayoutVisitor visitor;
	
	public Layout(SnapshotDao dao) {
		this.dao = dao;
	}
	
	public String startLayout(Integer snapshotId) throws DotExcecutorException {
		// STEP 1 ---
		this.visitor = new LayoutVisitor();
		// last output element could be used to start absolutepositioncalc
		InputElement root = this.accept(dao.getSnapshotById(snapshotId));
		Map<Integer, Graph> resultGraphs = this.visitor.getResultingGraphList();
		// ----------
		
		// debug output
		StringBuilder builder = new StringBuilder();
		
		builder.append("-------Result graphs without absolute position--------<br /><br />");
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
		
		// NEXT STEP HERE
		AbsolutePositionCalculator calc = new AbsolutePositionCalculator(dao, resultGraphs);
		List<Node> nodes = calc.calculate(snapshotId);
		// ---
		
		builder.append("-------Result graphs with absolute position--------<br /><br />");
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
		
		builder.append("-------Graph out of node list--------<br /><br />");
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
			layerElements.add(this.accept(dir));
		}
		
		List<Snapshot> childrenFiles = dao.getChildrenByScope(snapshot.getId(), Scopes.FILE);
		for (Snapshot file : childrenFiles) {
			layerElements.add(visitor.visitFile(file));
		}		
		
		InputElement layer = visitor.visitDir(snapshot, layerElements);
		
		return layer;
	}

}
