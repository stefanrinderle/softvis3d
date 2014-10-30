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
package de.rinderle.softviz3d.layout.calc;

/**
 * Created by srinderle on 26.09.14.
 */
public class Edge {

  private Integer projectId;
  private String depEdgeLabel;
  private Integer sourceId;
  private Integer destinationId;
  private Integer parentId;
  private int counter = 1;

  public Edge(final Integer projectId, final String depEdgeLabel, final Integer sourceId, final Integer destinationId,
    final Integer parentId) {
    this.projectId = projectId;
    this.depEdgeLabel = depEdgeLabel;
    this.sourceId = sourceId;
    this.destinationId = destinationId;
    this.parentId = parentId;
  }

  public Integer getProjectId() {
    return projectId;
  }

  public String getDepEdgeLabel() {
    return depEdgeLabel;
  }

  public Integer getSourceId() {
    return sourceId;
  }

  public Integer getDestinationId() {
    return destinationId;
  }

  public Integer getParentId() {
    return parentId;
  }

  public int getCounter() {
    return counter;
  }

  public void setCounter(final int counter) {
    this.counter = counter;
  }
}
