package de.rinderle.softviz3d.layout;

import java.awt.Color;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import att.grappa.Graph;
import att.grappa.GrappaPoint;
import att.grappa.Node;
import de.rinderle.softviz3d.layout.interfaces.SourceObject;
import de.rinderle.softviz3d.layout.model.LayeredLayoutElement.Type;
import de.rinderle.softviz3d.layout.model.Point3d;

public class ViewLayerCalculator {
	private static final Logger LOGGER = LoggerFactory.getLogger(ViewLayerCalculator.class);
	
	private Graph graph;
	
	public Graph calculate(Graph graph, SourceObject source) {
		this.graph = graph;
		
		this.adjustLayoutToX3d(source.getDepth(), source.getIdentifier());
		
		return this.graph;
	}

	// public function getLayerMargin() {
	// return $this->layerMargin;
	// }
	
	private void adjustLayoutToX3d(Integer depth, Integer snapshotId) {
		this.adjustBb(graph, depth, snapshotId);

		for (Node node : graph.nodeElementsAsArray()) {
			if (node.getAttributeValue("type").toString().equals(Type.NODE.name())) {
		    	this.adjustNode(node);
		    } else if (node.getAttributeValue("type").toString().equals(Type.LEAF.name())) {
		    	this.adjustLeaf(node);
		    } else {
		    	LOGGER.warn("Unsupported InputElementType");
		    }
		}
	}

	private void adjustLeaf(Node node) {
		//TODO SRI calc metric for height
		
//		$width = $node['attributes']['width'] * LayoutVisitor::$SCALE;
		// !!! METRIC CALCULATION FOR 3D LAYOUT
		/**
		 * If only one metric is given, it will be represented by the
		 * building volume. Therefore the side length is set in 2D and the
		 * same value will be set for the 3D height here. Given 2 Metrics, first is the side length
		 * second is the 3D height. Given none, default values.
		 */
//		if (array_key_exists('metric1', $node['attributes']) &&
//				array_key_exists('metric2', $node['attributes'])) {
//			$height = round($node['attributes']['metric2'] * LayoutVisitor::$SCALE / 2);
//		} else {
//			$height = $width;
//		}
	
//		$position = $node['attributes']['pos'];
//		$translation = array($position[0], 0, $position[1]);
//		$size = array('width'=>$width, 'height'=>$height, 'length'=>$width);
		
		GrappaPoint pos = (GrappaPoint) node.getAttributeValue("pos");
		
		Point3d translation = new Point3d(pos.getX(), 0.0, pos.getY());
		double transparency = 0.0;
		Color color = new Color(255, 140, 0);
		
		node.setAttribute("color", color);
		node.setAttribute("translation", translation.toString());
		node.setAttribute("transparency", transparency + "");
		node.setAttribute("height", 20 + "");
	}
	
	private void adjustNode(Node node) {
		GrappaPoint pos = (GrappaPoint) node.getAttributeValue("pos");
		
		Color color = new Color(0, 0, 0);
		Point3d translation = new Point3d(pos.getX(), 0.0, pos.getY());
		double transparency = 0.0;
		
		node.setAttribute("color", color);
		node.setAttribute("translation", translation.toString());
		node.setAttribute("transparency", transparency + "");
	}

	private void adjustBb(Graph graph, Integer depth, Integer snapshotId) {
//		$bb = $layerLayout['attributes']['bb'];
//		$width = round($bb[2] - $bb[0], 2);
//		$length = round($bb[3] - $bb[1], 2);
		
		Point3d translation = new Point3d(0.0, 0.0, 0.0);
		double transparency = 0.0;
		
		//TODO SRI color calc on dpeth
		// calc color
//		int colorCalc = (depth - 1) * 76;
//		if (colorCalc > 255) {
//			colorCalc = 255;
//		}
		
		Color color = new Color(200, 200, 255);
		
		graph.setAttribute("color", color);
		graph.setAttribute("translation", translation.toString());
		graph.setAttribute("transparency", transparency + "");
	}

}
