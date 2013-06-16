//package de.rinderle.softviz3d.dot;
//
//import java.util.List;
//
//import org.sonar.api.database.model.Snapshot;
//import org.sonar.api.resources.Scopes;
//
//import att.grappa.Attribute;
//import att.grappa.Graph;
//import att.grappa.GrappaConstants;
//import att.grappa.Node;
//import att.grappa.Subgraph;
//import de.rinderle.softviz3d.SoftViz3dExtension;
//import de.rinderle.softviz3d.dao.MeasureDao;
//import de.rinderle.softviz3d.dao.SnapshotDao;
//
///**
// * Not used anymore
// */
//@Deprecated
//public class GraphBuilder {
//
////	private static final Logger LOGGER = LoggerFactory
////			.getLogger(GraphBuilder.class);
//	
//	private Integer metricId1;
//	private Integer metricId2;
//	
//	private Graph graph;
//	
//	private SnapshotDao snapshotDao;
//	private MeasureDao measureDao;
//	
//	public GraphBuilder(SnapshotDao snapshotDao, MeasureDao measureDao) {
//		this.snapshotDao = snapshotDao;
//		this.measureDao = measureDao;
//	}
//
//	public Graph createGraphForSnapshot(Integer snapshotId, Integer metricId1, Integer metricId2) {
//		Snapshot snapshot = snapshotDao.getSnapshotById(snapshotId);
//		this.metricId1 = metricId1;
//		this.metricId2 = metricId2;
//
//		// TODO SRI get project name here
//		String graphName = snapshot.getId().toString();
//		graph = new Graph(graphName);
//
//		List<Snapshot> children = snapshotDao.getChildren(snapshot.getId());
//
//		for (Snapshot child : children) {
//			addDirectSubgraph(child, graph);
//		}
//		
//		return graph;
//	}
//	
//	private void addDirectSubgraph(Snapshot snapshot,
//			Subgraph parentSubgraph) {
//		if (snapshot.getScope().equals(Scopes.DIRECTORY)) {
//			addSubgraph(snapshot);
//		} else if (snapshot.getScope().equals(Scopes.FILE)) {
//			addNode(snapshot, parentSubgraph);
//		}
//	}
//
//	private void addNode(Snapshot snapshot, Subgraph parentSubgraph) {
//		Double result1 = measureDao.getMeasureDataById(snapshot.getId(),
//				metricId1);
//		Double result2 = measureDao.getMeasureDataById(snapshot.getId(),
//				metricId2);
//
//		Node node = new Node(parentSubgraph, snapshot.getId().toString());
//		node.setAttribute(new Attribute(GrappaConstants.NODE,
//				SoftViz3dExtension.SOFTVIZ3D_METRIC1_NAME, result1.toString()));
//		node.setAttribute(new Attribute(GrappaConstants.NODE,
//				SoftViz3dExtension.SOFTVIZ3D_METRIC2_NAME, result2.toString()));
//
//		graph.addNode(node);
//	}
//
//	private void addSubgraph(Snapshot snapshot) {
//		String subgraphId = snapshot.getId().toString();
//		Subgraph subgraph = new Subgraph(graph, subgraphId);
//		graph.addSubgraph(subgraph);
//
//		List<Snapshot> children = snapshotDao.getChildren(snapshot.getId());
//
//		for (Snapshot child : children) {
//			addDirectSubgraph(child, subgraph);
//		}
//	}
//
//}