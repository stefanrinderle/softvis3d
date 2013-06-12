package de.rinderle.softviz3d.layout;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sonar.api.database.model.Snapshot;
import org.sonar.api.resources.Scopes;

import att.grappa.Graph;

import de.rinderle.softviz3d.dao.SnapshotDao;
import de.rinderle.softviz3d.dot.DotExcecutorException;
import de.rinderle.softviz3d.dot.StringOutputStream;
import de.rinderle.softviz3d.layout.model.InputElement;

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
		
		LOGGER.info("root element is " + root.toString());
		
		List<Graph> resultGraphs = this.visitor.resultingGraphList();
		
		StringBuilder builder = new StringBuilder();
		for (Graph graph : resultGraphs) {
			StringOutputStream os = new StringOutputStream();
			builder.append("-----------------------\n");
			graph.printGraph(os);
			builder.append(os.toString());
			builder.append("-----------------------\n");
		}
		
		return builder.toString();
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
