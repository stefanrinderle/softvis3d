package de.rinderle.softviz3d;

import java.io.OutputStream;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sonar.api.ServerExtension;
import org.sonar.api.database.DatabaseSession;

import att.grappa.Graph;
import de.rinderle.softviz3d.dao.MeasureDao;
import de.rinderle.softviz3d.dao.SnapshotDao;
import de.rinderle.softviz3d.dot.DotExcecutor;
import de.rinderle.softviz3d.dot.DotExcecutorException;
import de.rinderle.softviz3d.dot.GraphBuilder;
import de.rinderle.softviz3d.dot.StringOutputStream;

public class SoftViz3dExtension implements ServerExtension {

	private static final Logger LOGGER = LoggerFactory
			.getLogger(SoftViz3dExtension.class);

	public static final String SOFTVIZ3D_METRIC1_NAME = "metric1";
	public static final String SOFTVIZ3D_METRIC2_NAME = "metric2";

	private SnapshotDao snapshotDao;
	private MeasureDao measureDao;

	public SoftViz3dExtension(DatabaseSession session) {
		 this.measureDao = new MeasureDao(session);
		this.snapshotDao = new SnapshotDao(session);
	}

	public String createLayoutBySnapshotId(Integer snapshotId, Integer metricId1,
			Integer metricId2) {

		GraphBuilder builder = new GraphBuilder(snapshotDao, measureDao);
		Graph graph = builder.createGraphForSnapshot(snapshotId, metricId1, metricId1);

		Graph adotGraph;
		try {
			adotGraph = DotExcecutor.run(graph);
		} catch (DotExcecutorException e) {
			adotGraph = new Graph("error");
			LOGGER.warn("mhhh: " + e.getMessage());
		}

		OutputStream output = new StringOutputStream();
		adotGraph.printGraph(output);

		LOGGER.info("output.toString() send to template");
		
		return output.toString();
	}

}
