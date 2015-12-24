/*
 * softvis3d-base
 * Copyright (C) 2015 Stefan Rinderle
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
package de.rinderle.softvis3d.base.domain.tree;

import java.util.ArrayList;
import java.util.List;

public class Edge {

  private final String depEdgeLabel;
  private final Integer sourceId;
  private final String sourceName;
  private final Integer destinationId;
  private final String destinationName;

  private final List<Long> includingDependencies = new ArrayList<>();

  public Edge(final String depEdgeLabel, final Integer sourceId,
    final String sourceName, final Integer destinationId,
    final String destinationName) {
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

  public void addIncludingDependency(final Long dependencyId) {
    includingDependencies.add(dependencyId);
  }

  public List<Long> getIncludingDependencies() {
    return includingDependencies;
  }
}
