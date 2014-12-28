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
  private final String sourceName;
  private final Integer destinationId;
  private final String destinationName;

  private List<BigInteger> includingDependencies = new ArrayList<BigInteger>();

  public Edge(final String depEdgeLabel, final Integer sourceId, String sourceName,
              final Integer destinationId, String destinationName) {
    this.depEdgeLabel = depEdgeLabel;
    this.sourceId = sourceId;
    this.sourceName = sourceName;
    this.destinationId = destinationId;
    this.destinationName = destinationName;
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

  public String getSourceName() {
    return sourceName;
  }

  public String getDestinationName() {
    return destinationName;
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
