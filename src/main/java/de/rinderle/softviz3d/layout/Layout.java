package de.rinderle.softviz3d.layout;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sonar.api.database.model.Snapshot;
import org.sonar.api.resources.Scopes;

import de.rinderle.softviz3d.dao.SnapshotDao;
import de.rinderle.softviz3d.dot.DotExcecutorException;
import de.rinderle.softviz3d.layout.model.Element;

public class Layout {

	private static final Logger LOGGER = LoggerFactory
			.getLogger(Layout.class);
	
	private SnapshotDao dao;
	private LayoutVisitor visitor;
	
	public Layout(SnapshotDao dao) {
		this.dao = dao;
		this.visitor = new LayoutVisitor();
	}
	
	public Element startLayout(Integer snapshotId) throws DotExcecutorException {
		return this.accept(dao.getSnapshotById(snapshotId));
	}
	
	public Element accept(Snapshot snapshot) throws DotExcecutorException {
		ArrayList<Element> layerElements = new ArrayList<Element>();
		
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
		
		Element layer = visitor.visitDir(snapshot, layerElements);
		return layer;
	}
}
