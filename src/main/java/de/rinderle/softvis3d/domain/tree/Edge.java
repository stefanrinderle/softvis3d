/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.domain.tree;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;

public class Edge {

  private final String depEdgeLabel;
  private final Integer sourceId;
  private final Integer destinationId;
  private final Integer parentId;

  private List<BigInteger> includingDependencies = new ArrayList<BigInteger>();

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

  public int getIncludingDependenciesSize() {
    return this.includingDependencies.size();
  }

  public void addIncludingDependency(BigInteger dependencyId) {
    includingDependencies.add(dependencyId);
  }

  public List<BigInteger> getIncludingDependencies() {
    return includingDependencies;
  }
}
