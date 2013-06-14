package de.rinderle.softviz3d.layout;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sonar.api.database.model.Snapshot;

import att.grappa.Graph;
import att.grappa.GrappaBox;
import att.grappa.GrappaPoint;
import att.grappa.Node;
import de.rinderle.softviz3d.layout.model.InputElementType;
import de.rinderle.softviz3d.layout.model.X3dBoxElement;

public class ViewLayerCalculator {
	private static final Logger LOGGER = LoggerFactory.getLogger(ViewLayerCalculator.class);
	
	private Graph graph;
	
	public Graph calculate(Graph graph, Snapshot snapshot) {
		this.graph = graph;
		
		this.adjustLayoutToX3d(snapshot.getDepth(), snapshot.getId());
		
		return this.graph;
	}

	// public function getLayerMargin() {
	// return $this->layerMargin;
	// }
	
	private List<X3dBoxElement> adjustLayoutToX3d(Integer depth, Integer snapshotId) {
		List<X3dBoxElement> resultElements = new ArrayList<X3dBoxElement>();
		resultElements.add(this.adjustBb(graph, depth, snapshotId));

		for (Node node : graph.nodeElementsAsArray()) {
			if (node.getAttributeValue("type").toString().equals(InputElementType.NODE.name())) {
		    	resultElements.add(this.adjustNode(node));
		    } else if (node.getAttributeValue("type").toString().equals(InputElementType.LEAF.name())) {
		    	// TODO SRI sart work here
//		    	this.adjustLeaf(node);
		    } else {
		    	LOGGER.warn("Unsupported InputElementType");
		    }
		}
		
		return resultElements;
	}

	private X3dBoxElement adjustNode(Node node) {
		String id = node.getAttributeValue("id").toString();
		Integer snapshotId;
		snapshotId = Integer.valueOf(node.getAttributeValue("snapshotId").toString());
		
		double[] size = new double[] {
				(Double) node.getAttributeValue("width"),
				(Double) node.getAttributeValue("height") };
		
		GrappaPoint pos = (GrappaPoint) node.getAttributeValue("pos");
		
		double[] color = new double[] {0, 0, 0};
		double[] translation = new double[] {pos.getX(), 0, pos.getY()};
		double transparency = 0.0;
		
		X3dBoxElement x3dElement = new X3dBoxElement(id, snapshotId, translation, color, transparency, size);
		return x3dElement;
	}

	private X3dBoxElement adjustBb(Graph graph, Integer depth, Integer snapshotId) {
//		$bb = $layerLayout['attributes']['bb'];
//		$width = round($bb[2] - $bb[0], 2);
//		$length = round($bb[3] - $bb[1], 2);

		GrappaBox bb = (GrappaBox) graph.getAttributeValue("bb");
		
		String id = "bb_" + snapshotId;
		double[] size = new double[] {bb.getWidth(), bb.getHeight()};
		double[] translation = new double[] {0, 0, 0};
		double transparency = 0.0;
		
		// calc color
		double colorCalc = (depth - 1) * 0.3;
		if (colorCalc > 1.0) {
			colorCalc = 1.0;
		}
		
		double [] color = new double[] {0.87 - colorCalc, 1 - colorCalc, 1};
		
		X3dBoxElement x3dElement = new X3dBoxElement(id, snapshotId, translation, color, transparency, size);
		return x3dElement;
	}

}
