/**
 * SoftVis3D Sonar plugin
 * Copyright (C) 2016 Stefan Rinderle and Yvo Niedrich
 * stefan@rinderle.info / yvo.niedrich@gmail.com
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

import java.util.Arrays;
import java.util.Objects;

public class VisualizationRequest {

  private final String rootSnapshotKey;

  private final String[] metrics;

  public VisualizationRequest(final String rootSnapshotKey, final String[] metrics) {
    this.rootSnapshotKey = rootSnapshotKey;

    this.metrics = metrics;
  }

  public String getRootSnapshotKey() {
    return this.rootSnapshotKey;
  }

  public String[] getMetrics() {
    return metrics;
  }

  @Override
  public String toString() {
    return "VisualizationRequest{" + "rootSnapshotKey='" + rootSnapshotKey + '\'' + ", metrics=" + Arrays.toString(
        metrics) + '}';
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    final VisualizationRequest that = (VisualizationRequest) o;
    return Objects.equals(rootSnapshotKey, that.rootSnapshotKey) && Arrays.equals(metrics, that.metrics);
  }

  @Override
  public int hashCode() {
    return Objects.hash(rootSnapshotKey, metrics);
  }

}
