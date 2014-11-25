/*
 * SoftVis3D Sonar plugin
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
package de.rinderle.softvis3d.domain.tree;

public class Edge {

  private final String depEdgeLabel;
  private final Integer sourceId;
  private final Integer destinationId;
  private final Integer parentId;
  private int counter = 1;

  public Edge(final String depEdgeLabel, final Integer sourceId, final Integer destinationId,
    final Integer parentId) {
    this.depEdgeLabel = depEdgeLabel;
    this.sourceId = sourceId;
    this.destinationId = destinationId;
    this.parentId = parentId;
  }

  public String getDepEdgeLabel() {
    return this.depEdgeLabel;
  }

  public Integer getSourceId() {
    return this.sourceId;
  }

  public Integer getDestinationId() {
    return this.destinationId;
  }

  public Integer getParentId() {
    return this.parentId;
  }

  public int getCounter() {
    return this.counter;
  }

  public void setCounter(final int counter) {
    this.counter = counter;
  }
}
