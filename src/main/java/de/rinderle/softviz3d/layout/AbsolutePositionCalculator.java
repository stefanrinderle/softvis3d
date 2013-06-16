package de.rinderle.softviz3d.layout;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import att.grappa.Graph;
import att.grappa.GrappaBox;
import att.grappa.GrappaPoint;
import att.grappa.Node;
import de.rinderle.softviz3d.layout.interfaces.SourceObject;
import de.rinderle.softviz3d.layout.model.Point3d;

public class AbsolutePositionCalculator {

	private static final Logger LOGGER = LoggerFactory
	.getLogger(AbsolutePositionCalculator.class);
	
	private Map<Integer, Graph> inputGraphs;
	private List<Node> outputNodeList;
	
	public AbsolutePositionCalculator(Map<Integer, Graph> inputGraphList) {
		this.inputGraphs = inputGraphList;
		this.outputNodeList = new ArrayList<Node>();
	}
	
	public List<Node> calculate(SourceObject source) {
		this.addTranslationToLayer(source, new Point3d(0, 0, 0));
		return outputNodeList;
	}

	private void addTranslationToLayer(SourceObject source, Point3d parentPos3d) {
		LOGGER.info("parentPos3d snapshotId " + source.getIdentifier() + " " + parentPos3d.toString());
		Graph graph = inputGraphs.get(source.getIdentifier());

		// any graph in here has a valid bb attribute
		GrappaBox bb = (GrappaBox) graph.getAttributeValue("bb");
		
		//TODO SRI what is x y and z at this point??
//		Point3d newTranslation = new Point3d(parent3dPos.getX() + bb.getX(), 
//				parent3dPos.getY() + bb.getY(), 0.0);
//
//		for (Node node : graph.nodeElementsAsArray()) {
//			graph.removeNode(node.getName());
//			
//			GrappaPoint pos = (GrappaPoint) node.getAttributeValue("pos");
//			//TODO SRI what is x y and z at this point??
//			pos.setLocation(pos.getX() + newTranslation.getX(), pos.getY()
//					+ newTranslation.getY());
//			node.setAttribute("pos", pos);
//
//			graph.addNode(node);
//			outputNodeList.add(node);
//		}
//
//		inputGraphs.put(source.getIdentifier(), graph);
//		
//		List<? extends SourceObject> children = source.getChildrenNodes();
//
//		for (SourceObject key : children) {
//			addTranslationToLayer(key, newTranslation);
//		}
	}
}
