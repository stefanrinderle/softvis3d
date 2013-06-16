package de.rinderle.softviz3d;

import javax.persistence.PersistenceException;
import javax.persistence.Query;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sonar.api.ServerExtension;
import org.sonar.api.database.DatabaseSession;
import org.sonar.api.database.model.Snapshot;

import de.rinderle.softviz3d.dao.MeasureDao;
import de.rinderle.softviz3d.dot.DotExcecutorException;
import de.rinderle.softviz3d.layout.Layout;
import de.rinderle.softviz3d.layout.LayoutVisitor;
import de.rinderle.softviz3d.layout.interfaces.SnapshotWrapper;

public class SoftViz3dExtension implements ServerExtension {

	private static final Logger LOGGER = LoggerFactory
			.getLogger(SoftViz3dExtension.class);

	public static final String SOFTVIZ3D_METRIC1_NAME = "metric1";
	public static final String SOFTVIZ3D_METRIC2_NAME = "metric2";

	private MeasureDao measureDao;
	private DatabaseSession session;
	
	public SoftViz3dExtension(DatabaseSession session) {
		this.measureDao = new MeasureDao(session);
		this.session = session;
	}

	public String createLayoutBySnapshotId(Integer snapshotId,
			Integer metricId1, Integer metricId2) throws DotExcecutorException {

		Layout layout = new Layout(new LayoutVisitor());
		
		Snapshot snapshot = getSnapshotById(snapshotId);
		
		SnapshotWrapper wrapper = new SnapshotWrapper(snapshot, session);
		
		return layout.startLayout(wrapper);
	}

	private Snapshot getSnapshotById(Integer id) {
		Snapshot snapshot;

		try {
			session.start();
			Query query = session
					.createQuery("select s from Snapshot s where s.id = ?");
			query.setParameter(1, id);

			snapshot = (Snapshot) query.getSingleResult();
		} catch (PersistenceException e) {
			LOGGER.error(e.getMessage(), e);
			snapshot = null;
		} finally {
			session.stop();
		}

		return snapshot;
	}
	
}
