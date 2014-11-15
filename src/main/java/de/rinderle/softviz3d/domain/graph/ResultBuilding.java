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

import att.grappa.Edge;
import att.grappa.Node;

import java.util.ArrayList;
import java.util.List;

public class ResultBuilding extends BaseResultObject {

  private final Node node;

  private final List<ResultArrow> arrows;

  public ResultBuilding(Node node) {
    this.node = node;

    this.arrows = transformEdges(node.edgeElementsAsArray());
  }

  public int getId() {
    return node.getId();
  }

  public Object getAttributeValue(String value) {
    return node.getAttributeValue(value);
  }

  public void setAttribute(String key, String value) {
    node.setAttribute(key, value);
  }

  public void setAttribute(String key, double value) {
    node.setAttribute(key, value);
  }

  public List<ResultArrow> getArrows() {
    return arrows;
  }

  /**
   * Only process the edges which are on the start of the node,
   * otherwise each edge will be processed two times. One for
   * the head and one for the tail.
   */
  private List<ResultArrow> transformEdges(Edge[] inputEdges) {
    List<ResultArrow> result = new ArrayList<ResultArrow>();

    for (int i = 0; i < inputEdges.length; i = i + 1) {
      boolean isTailEnd = inputEdges[i].getTail().getId() == this.getId();
      if (isTailEnd) {
        result.add(transformEdge(inputEdges[i]));
      }
    }

    return result;
  }

  private ResultArrow transformEdge(Edge edge) {
    return new ResultArrow(edge);
  }
}
