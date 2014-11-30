/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
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
