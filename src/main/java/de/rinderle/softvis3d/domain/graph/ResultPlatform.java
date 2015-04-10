/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
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

    // TODO could be moved to a formatter.
    public static double PLATFORM_HEIGHT = 5;
    private final Map<String, ResultBuilding> nodes;
    private GrappaBox boundingBox;

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

    public GrappaBox getBoundingBox() {
        return boundingBox;
    }

    public void setBoundingBox(GrappaBox boundingBox) {
        this.boundingBox = boundingBox;
    }

    public Collection<ResultBuilding> getNodes() {
        return nodes.values();
    }

    public void removeNode(String key) {
        nodes.remove(key);
    }

    private Map<String, ResultBuilding> transformNodes(Node[] inputNodes) {
        Map<String, ResultBuilding> result = new HashMap<String, ResultBuilding>();

        for (Node inputNode : inputNodes) {
            result.put(inputNode.getName(), transformNode(inputNode));
        }

        return result;
    }

    private ResultBuilding transformNode(final Node node) {
        return new ResultBuildingBuilder().withNode(node).createResultBuilding();
    }

}
