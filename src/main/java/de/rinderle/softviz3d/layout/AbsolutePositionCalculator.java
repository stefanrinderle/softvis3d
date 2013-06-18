package de.rinderle.softviz3d.layout;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import att.grappa.Graph;
import att.grappa.GrappaBox;
import att.grappa.Node;
import de.rinderle.softviz3d.layout.interfaces.SourceObject;
import de.rinderle.softviz3d.layout.model.Point3d;

public class AbsolutePositionCalculator {

	private static final Logger LOGGER = LoggerFactory
	.getLogger(AbsolutePositionCalculator.class);
	
	private Map<Integer, Graph> inputGraphs;
	
	private Map<Integer, Point3d> innerGraphTranslation;
	
	public AbsolutePositionCalculator(Map<Integer, Graph> inputGraphList) {
		this.inputGraphs = inputGraphList;
		
		this.innerGraphTranslation = new HashMap<Integer, Point3d>();
		LOGGER.info("Count graphs" + inputGraphs.size());
	}
	
	public void calculate(SourceObject source) {
		// put it in the middle
		Graph graph = inputGraphs.get(source.getIdentifier());
		GrappaBox bb = (GrappaBox) graph.getAttributeValue("bb");
		
		this.addTranslationToLayer(source, new Point3d(0,0,0));//bb.getWidth() / 2, 0, bb.getHeight() / 2));
	}

	private void addTranslationToLayer(SourceObject source, Point3d point3dTranslation) {
//		LOGGER.info("point3dTranslation id " + source.getIdentifier() + " " + point3dTranslation.toString());
		
		// inputGraphs --> Map<Integer, Graph>
		// Step 1 - search the graph for the source given
		Graph graph = inputGraphs.get(source.getIdentifier());

		GrappaBox bb = (GrappaBox) graph.getAttributeValue("bb");

		LOGGER.warn("---- GRAPH ----" + graph.getName() + " " + point3dTranslation.toString());
		Point3d test = point3dTranslation;
		test.setX(point3dTranslation.getX());
		test.setY(point3dTranslation.getY());
		test.setZ(point3dTranslation.getZ());
//		LOGGER.warn("---- GRAPH ----" + graph.getName() + " " + test.toString());
		
		// Step 2 - set translation for the graph itself (will be a layer later)
		graph.setAttribute("pos3d", test.toString());
		
		// Step 3 - for all leaves, just add the parent point3d changes
		for (Node leaf : graph.nodeElementsAsArray()) {
			Point3d pos3d = new Point3d(leaf.getAttributeValue("pos3d").toString());
			
			pos3d.setX(pos3d.getX());
			pos3d.setY(point3dTranslation.getY());
			pos3d.setZ(pos3d.getZ());
			
			innerGraphTranslation.put(Integer.valueOf(leaf.getAttributeValue("id").toString()), pos3d);
			
			pos3d.setX(point3dTranslation.getX() + pos3d.getX() - bb.getWidth() / 2);
			pos3d.setZ(point3dTranslation.getZ() + pos3d.getZ() + bb.getHeight() / 2);
			LOGGER.warn("---- LEAF ----" + leaf.getAttributeValue("id") + " " + pos3d.toString());
			
			leaf.setAttribute("pos3d", pos3d.toString());
			
//			LOGGER.warn("---- HERE ----" + source.getIdentifier().toString());
		}
		
		// Step 4 - for all dirs, call this method (recursive) with the parent + the self changes
		for (SourceObject childrenSource : source.getChildrenNodes()) {
			Point3d translation = innerGraphTranslation.get(childrenSource.getIdentifier());
			translation.setY(translation.getY() + 30);
			
			LOGGER.warn("---- childrenSource ----" + childrenSource.getIdentifier());
			addTranslationToLayer(childrenSource, translation);
			
			graph.removeNode("dir_" + childrenSource.getIdentifier().toString());
		}
		
		LOGGER.warn("---- END GRAPH ----" + graph.getName());
		
	}

}
