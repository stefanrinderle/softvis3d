/*
 * SoftViz3d Sonar plugin
 * Copyright (C) 2013 Stefan Rinderle
 * stefan@rinderle.info
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02
 */
package de.rinderle.softviz3d.domain.graph;

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
  private double platformHeight = 5;

  public ResultPlatform(Graph graph) {
    this.boundingBox = (GrappaBox) graph.getAttributeValue("bb");
    this.nodes = transformNodes(graph.nodeElementsAsArray());
  }

  /**
   * Used in view.
   */
  public double getPlatformHeight() {
    return platformHeight;
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
