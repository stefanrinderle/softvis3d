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

public class SonarDependency {

  private Long id;
  private final Integer fromSnapshotId;
  private final Integer toSnapshotId;

  public SonarDependency(final SonarDependencyBuilder sonarDependencyBuilder) {
    this.id = sonarDependencyBuilder.id;
    this.fromSnapshotId = sonarDependencyBuilder.fromSnapshotId;
    this.toSnapshotId = sonarDependencyBuilder.toSnapshotId;
  }

  public Long getId() {
    return this.id;
  }

  public Integer getFromSnapshotId() {
    return this.fromSnapshotId;
  }

  public Integer getToSnapshotId() {
    return this.toSnapshotId;
  }

  @Override
  public String toString() {
    return "SonarDependency{" + "id=" + id + ", fromSnapshotId=" + fromSnapshotId + ", toSnapshotId='"
      + toSnapshotId + '\'' + '}';
  }

}
