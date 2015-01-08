/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.domain.graph;

import att.grappa.Graph;
import att.grappa.GrappaBox;
import att.grappa.Node;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

public class ResultPlatform extends BaseResultObject {

	private final Map<String, ResultBuilding> nodes;
	private GrappaBox boundingBox;

	// TODO could be moved to a formatter.
	public static double PLATFORM_HEIGHT = 5;

	public ResultPlatform(Graph graph) {
		this.boundingBox = (GrappaBox) graph.getAttributeValue("bb");
		this.nodes = transformNodes(graph.nodeElementsAsArray());
	}

	/**
	 * Used in view.
	 */
	public double getPlatformHeight() {
		return PLATFORM_HEIGHT;
	}

	public void setBoundingBox(GrappaBox boundingBox) {
		this.boundingBox = boundingBox;
	}

	public GrappaBox getBoundingBox() {
		return boundingBox;
	}

	public ResultBuilding findNodeByName(String key) {
		return nodes.get(key);
	}

	public Collection<ResultBuilding> getNodes() {
		return nodes.values();
	}

	public void removeNode(String key) {
		nodes.remove(key);
	}

	private Map<String, ResultBuilding> transformNodes(Node[] inputNodes) {
		Map<String, ResultBuilding> result = new HashMap<String, ResultBuilding>();

		for (int i = 0; i < inputNodes.length; i = i + 1) {
			result.put(inputNodes[i].getName(), transformNode(inputNodes[i]));
		}

		return result;
	}

	private ResultBuilding transformNode(Node node) {
		return new ResultBuilding(node);
	}

}
