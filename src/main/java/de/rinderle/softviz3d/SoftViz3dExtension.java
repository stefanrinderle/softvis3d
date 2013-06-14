package de.rinderle.softviz3d;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sonar.api.ServerExtension;
import org.sonar.api.database.DatabaseSession;

import de.rinderle.softviz3d.dao.MeasureDao;
import de.rinderle.softviz3d.dao.SnapshotDao;
import de.rinderle.softviz3d.dot.DotExcecutorException;
import de.rinderle.softviz3d.layout.Layout;

public class SoftViz3dExtension implements ServerExtension {

	private static final Logger LOGGER = LoggerFactory
			.getLogger(SoftViz3dExtension.class);

	public static final String SOFTVIZ3D_METRIC1_NAME = "metric1";
	public static final String SOFTVIZ3D_METRIC2_NAME = "metric2";

	private SnapshotDao snapshotDao;
	private MeasureDao measureDao;

	/**
	 * INSTALL COBERTURA
	 * @param session
	 */
	
	public SoftViz3dExtension(DatabaseSession session) {
		this.measureDao = new MeasureDao(session);
		this.snapshotDao = new SnapshotDao(session);
	}

	public String createLayoutBySnapshotId(Integer snapshotId,
			Integer metricId1, Integer metricId2) throws DotExcecutorException {

		Layout layout = new Layout(snapshotDao);
		
		return layout.startLayout(snapshotId);
	}

}
