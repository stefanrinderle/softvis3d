/*
 * SoftVis3D Sonar plugin
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
package de.rinderle.softvis3d.domain;

import de.rinderle.softvis3d.base.domain.LayoutViewType;
import de.rinderle.softvis3d.domain.sonar.ScmInfoType;
import java.util.Objects;

public class VisualizationRequest {

  private final String rootSnapshotKey;

  private final LayoutViewType viewType;

  private final String footprintMetricKey;
  private final String heightMetricKey;
  private final ScmInfoType scmInfoType;

  public VisualizationRequest(final String rootSnapshotKey, final String footprintMetricKey, final String heightMetricKey, final ScmInfoType scmInfoType) {
    this.rootSnapshotKey = rootSnapshotKey;

    this.viewType = LayoutViewType.CITY;

    this.footprintMetricKey = footprintMetricKey;
    this.heightMetricKey = heightMetricKey;

    this.scmInfoType = scmInfoType;
  }

  public String getRootSnapshotKey() {
    return this.rootSnapshotKey;
  }

  public LayoutViewType getViewType() {
    return this.viewType;
  }

  public String getFootprintMetricKey() {
    return this.footprintMetricKey;
  }

  public String getHeightMetricKey() {
    return this.heightMetricKey;
  }

  public ScmInfoType getScmInfoType() {
    return scmInfoType;
  }

  @Override
  public String toString() {
    return "VisualizationRequest{" +
        "rootSnapshotKey='" + rootSnapshotKey + '\'' +
        ", viewType=" + viewType +
        ", footprintMetricKey='" + footprintMetricKey + '\'' +
        ", heightMetricKey='" + heightMetricKey + '\'' +
        ", scmInfoType=" + scmInfoType +
        '}';
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    VisualizationRequest that = (VisualizationRequest) o;
    return Objects.equals(rootSnapshotKey, that.rootSnapshotKey) &&
        viewType == that.viewType &&
        Objects.equals(footprintMetricKey, that.footprintMetricKey) &&
        Objects.equals(heightMetricKey, that.heightMetricKey) &&
        scmInfoType == that.scmInfoType;
  }

  @Override
  public int hashCode() {
    return Objects.hash(rootSnapshotKey, viewType, footprintMetricKey, heightMetricKey, scmInfoType);
  }
}
