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

public class SonarSnapshot {

  private final int id;
  private final double footprintMetricValue;
  private final double heightMetricValue;
  private final int authorCount;
  private String path;

  public SonarSnapshot(SonarSnapshotBuilder snapshotBuilder) {
    this.id = snapshotBuilder.id;
    this.path = snapshotBuilder.path;
    this.footprintMetricValue = snapshotBuilder.footprintMetricValue;
    this.heightMetricValue = snapshotBuilder.heightMetricValue;
    this.authorCount = snapshotBuilder.authorCount;
  }

  public int getId() {
    return id;
  }

  public String getPath() {
    return path;
  }

  public void setPath(String path) {
    this.path = path;
  }

  public double getFootprintMetricValue() {
    return footprintMetricValue;
  }

  public double getHeightMetricValue() {
    return heightMetricValue;
  }

  public int getAuthorCount() {
    return authorCount;
  }

  @Override
  public String toString() {
    return "SonarSnapshot{" + "id=" + id + ", path='" + path + '\'' + ", footprintMetricValue="
      + footprintMetricValue + ", heightMetricValue=" + heightMetricValue + '}';
  }

}
