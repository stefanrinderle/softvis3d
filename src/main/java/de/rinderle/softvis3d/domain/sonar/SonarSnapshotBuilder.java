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
package de.rinderle.softvis3d.domain.sonar;

public class SonarSnapshotBuilder {

  public int authorCount;
  int id;
  String path;
  double footprintMetricValue = 0.0;
  double heightMetricValue = 0.0;

  public SonarSnapshotBuilder(final int id) {
    this.id = id;
  }

  public SonarSnapshotBuilder withPath(final String resourcePath) {
    this.path = resourcePath;
    return this;
  }

  public SonarSnapshotBuilder withFootprintMeasure(final Double metricValue) {
    if (metricValue != null) {
      this.footprintMetricValue = metricValue;
    }

    return this;
  }

  public SonarSnapshotBuilder withHeightMeasure(final Double metricValue) {
    if (metricValue != null) {
      this.heightMetricValue = metricValue;
    }

    return this;
  }

  public SonarSnapshotBuilder differentAuthors(final int differentAuthors) {
    this.authorCount = differentAuthors;

    return this;
  }

  public SonarSnapshot build() {
    return new SonarSnapshot(this);
  }

}
