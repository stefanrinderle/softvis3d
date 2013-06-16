package de.rinderle.softviz3d.layout;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import att.grappa.Graph;
import att.grappa.Node;
import de.rinderle.softviz3d.layout.interfaces.SourceObject;
import de.rinderle.softviz3d.layout.model.Point3d;

public class AbsolutePositionCalculator {

	private static final Logger LOGGER = LoggerFactory
	.getLogger(AbsolutePositionCalculator.class);
	
	private Map<Integer, Graph> inputGraphs;
	
	public AbsolutePositionCalculator(Map<Integer, Graph> inputGraphList) {
		this.inputGraphs = inputGraphList;
	}
	
	public void calculate(SourceObject source) {
		this.addTranslationToLayer(source, new Point3d(0, 0, 0));
	}

	private void addTranslationToLayer(SourceObject source, Point3d point3dTranslation) {
		LOGGER.info("point3dTranslation id " + source.getIdentifier() + " " + point3dTranslation.toString());
		
		// inputGraphs --> Map<Integer, Graph>
		// Step 1 - search the graph for the source given
		Graph graph = inputGraphs.get(source.getIdentifier());

		// Step 2 - set translation for the graph itself (will be a layer later)
		graph.setAttribute("pos3d", point3dTranslation.toString());
		
		Map<Integer, Point3d> innerGraphTranslation = new HashMap<Integer, Point3d>();
		
		// Step 3 - for all leaves, just add the parent point3d changes
		for (Node leaf : graph.nodeElementsAsArray()) {
			Point3d pos3d = new Point3d(leaf.getAttributeValue("pos3d").toString());
			
			pos3d.setX(pos3d.getX() + point3dTranslation.getX());
			pos3d.setY(pos3d.getY() + point3dTranslation.getY());
			pos3d.setZ(pos3d.getZ() + point3dTranslation.getZ());
			
			innerGraphTranslation.put(Integer.valueOf(leaf.getAttributeValue("id").toString()), pos3d);
			
			leaf.setAttribute("pos3d", pos3d.toString());
		}
		
		// Step 4 - for all dirs, call this method (recursive) with the parent + the self changes
		for (SourceObject childrenSource : source.getChildrenNodes()) {
			Point3d translation = innerGraphTranslation.get(childrenSource.getIdentifier());
			addTranslationToLayer(childrenSource, translation);
		}
		
	}

}
