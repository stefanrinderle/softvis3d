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
import de.rinderle.softviz3d.layout.helper.HexaColor;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

public class ResultPlatform {

  private final Graph graph;

  private final Map<String, ResultBuilding> nodes;

  public ResultPlatform(Graph graph) {
    this.graph = graph;

    this.nodes = transformNodes(graph.nodeElementsAsArray());
  }

  public void setAttribute(final String attribute, final HexaColor value) {
    graph.setAttribute(attribute, value);
  }

  public void setAttribute(String attribute, String value) {
    graph.setAttribute(attribute, value);
  }

  public void setAttribute(String key, GrappaBox value) {
    graph.setAttribute(key, value);
  }

  public Object getAttributeValue(String key) {
    return graph.getAttributeValue(key);
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
