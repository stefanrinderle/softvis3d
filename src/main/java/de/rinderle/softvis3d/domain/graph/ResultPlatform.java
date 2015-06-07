/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
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
package de.rinderle.softvis3d.domain.graph;

import att.grappa.Graph;
import att.grappa.GrappaBox;
import att.grappa.Node;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

public class ResultPlatform extends BaseResultObject {

  // TODO could be moved to a formatter.
  public static final double PLATFORM_HEIGHT = 5;
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
