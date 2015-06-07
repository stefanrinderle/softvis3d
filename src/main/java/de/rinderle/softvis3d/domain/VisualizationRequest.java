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
package de.rinderle.softvis3d.domain;

import org.apache.commons.lang.builder.EqualsBuilder;
import org.apache.commons.lang.builder.HashCodeBuilder;

public class VisualizationRequest {

  private final int rootSnapshotId;

  private final LayoutViewType viewType;

  private final int footprintMetricId;
  private final int heightMetricId;

  public VisualizationRequest(int rootSnapshotId, LayoutViewType viewType, int footprintMetricId, int heightMetricId) {
    this.rootSnapshotId = rootSnapshotId;

    this.viewType = viewType;

    this.footprintMetricId = footprintMetricId;
    this.heightMetricId = heightMetricId;
  }

  public int getRootSnapshotId() {
    return this.rootSnapshotId;
  }

  public LayoutViewType getViewType() {
    return this.viewType;
  }

  public int getFootprintMetricId() {
    return this.footprintMetricId;
  }

  public int getHeightMetricId() {
    return this.heightMetricId;
  }

  @Override
  public String toString() {
    return "VisualizationRequest{" + "rootSnapshotId=" + rootSnapshotId + ", viewType=" + viewType
      + ", footprintMetricId=" + footprintMetricId + ", heightMetricId=" + heightMetricId + '}';
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }

    if (o == null || getClass() != o.getClass()) {
      return false;
    }

    VisualizationRequest that = (VisualizationRequest) o;

    return new EqualsBuilder()
            .append(rootSnapshotId, that.rootSnapshotId)
            .append(footprintMetricId, that.footprintMetricId)
            .append(heightMetricId, that.heightMetricId)
            .append(viewType, that.viewType)
            .isEquals();
  }

  @Override
  public int hashCode() {
    return new HashCodeBuilder(17, 37)
            .append(rootSnapshotId)
            .append(viewType)
            .append(footprintMetricId)
            .append(heightMetricId)
            .toHashCode();
  }
}
