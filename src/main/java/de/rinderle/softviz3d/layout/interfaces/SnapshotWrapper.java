package de.rinderle.softviz3d.layout.interfaces;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.PersistenceException;
import javax.persistence.Query;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sonar.api.database.DatabaseSession;
import org.sonar.api.database.model.Snapshot;
import org.sonar.api.resources.Scopes;

import de.rinderle.softviz3d.layout.Layout;

public class SnapshotWrapper implements SourceObject {

	private static final Logger LOGGER = LoggerFactory
			.getLogger(Layout.class);
	
	private Snapshot snapshot;
	private DatabaseSession session;
	
	public SnapshotWrapper(Snapshot snapshot, DatabaseSession session) {
		this.snapshot = snapshot;
		this.session = session;
	}

	public Integer getIdentifier() {
		return snapshot.getId();
	}

	public String getName() {
		return snapshot.getResourceId() + "_name";
	}

	public Integer getDepth() {
		return snapshot.getDepth();
	}
	
	public List<SnapshotWrapper> getChildrenNodes() {
		return this.getChildrenByScope(Scopes.DIRECTORY);
	}

	public List<SnapshotWrapper> getChildrenLeaves() {
		return this.getChildrenByScope(Scopes.FILE);
	}

	public List<Integer> getChildrenIds() {
		List<Integer> childrenIds;

		try {
			session.start();
			Query query = session
					.createQuery("select s.id from Snapshot s where s.parentId = ?");
			query.setParameter(1, this.snapshot.getId());

			childrenIds = (List<Integer>) query.getResultList();
		} catch (PersistenceException e) {
			LOGGER.error(e.getMessage(), e);
			childrenIds = null;
		} finally {
			session.stop();
		}

		return childrenIds;
	}

	private List<SnapshotWrapper> getChildrenByScope(String scope) {
		List<Snapshot> snapshots;

		try {
			session.start();
			Query query = session
					.createQuery("select s from Snapshot s where s.parentId = ? and s.scope = ?");
			query.setParameter(1, this.snapshot.getId());
			query.setParameter(2, scope);

			snapshots = (List<Snapshot>) query.getResultList();
		} catch (PersistenceException e) {
			LOGGER.error(e.getMessage(), e);
			snapshots = null;
		} finally {
			session.stop();
		}

		return wrapSnapshotList(snapshots);
	}

	private List<SnapshotWrapper> wrapSnapshotList(List<Snapshot> snapshots) {
		List<SnapshotWrapper> result = new ArrayList<SnapshotWrapper>();
		
		for (Snapshot snapshot : snapshots) {
			result.add(new SnapshotWrapper(snapshot, session));
		}
		return result;
	}
	
}
