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
package de.rinderle.softvis3d;

import de.rinderle.softvis3d.domain.sonar.SonarDependency;
import de.rinderle.softvis3d.domain.sonar.SonarDependencyBuilder;

public class TestDependencyBuilder {

  public static SonarDependency createDependency(final int from, final int to) {
    final SonarDependencyBuilder result = new SonarDependencyBuilder();

    result.withId(new Long(from + "" + to));
    result.withFromSnapshotId(from);
    result.withToSnapshotId(to);

    return result.createSonarDependency();
  }

  public static SonarDependency createDependency(final String id, final int from, final int to) {
    final SonarDependencyBuilder result = new SonarDependencyBuilder();

    result.withId(new Long(id));
    result.withFromSnapshotId(from);
    result.withToSnapshotId(to);

    return result.createSonarDependency();
  }

}
