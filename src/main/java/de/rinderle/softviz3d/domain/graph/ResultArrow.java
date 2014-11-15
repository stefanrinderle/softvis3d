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

public class ResultArrow {

  private final Edge edge;

  private final int headBuildingId;
  private final int tailBuildingId;

  public ResultArrow(Edge edge) {
    this.edge = edge;

    this.headBuildingId = edge.getHead().getId();
    this.tailBuildingId = edge.getTail().getId();
  }

  public Object getAttributeValue(String value) {
    return edge.getAttributeValue(value);
  }

  public void setAttribute(String key, String value) {
    edge.setAttribute(key, value);
  }

  /**
   * used by view.
   */
  public int getTailId() {
    return tailBuildingId;
  }

  /**
   * used by view.
   */
  public int getHeadId() {
    return headBuildingId;
  }

}
