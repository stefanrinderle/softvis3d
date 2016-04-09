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
package de.rinderle.softvis3d.dao;

import com.google.inject.Singleton;
import de.rinderle.softvis3d.domain.sonar.SonarDependency;
import de.rinderle.softvis3d.domain.sonar.SonarDependencyBuilder;
import java.util.ArrayList;
import java.util.List;

/**
 * Use singleton to set the database session once on startup and to be sure that it is set on any other injection.
 */
@Singleton
public class DependencyDao {

//  private DatabaseSession session;
//
//  public void setDatabaseSession(final DatabaseSession session) {
//    this.session = session;
//  }

  public List<SonarDependency> getDependencies(final Integer projectSnapshotId) {
//    final String sqlQuery =
//      "SELECT d.id, d.fromSnapshotId, d.toSnapshotId FROM " + DependencyDto.class.getSimpleName() + " d "
//        + "WHERE d.projectSnapshotId = :projectSnapshotId AND fromScope = 'FIL' AND toScope = 'FIL' ";
//
//    final Query query = this.session.createQuery(sqlQuery);
//
//    query.setParameter("projectSnapshotId", projectSnapshotId);
//
//    final List<Object[]> queryResult = (List<Object[]>) query.getResultList();
//
//    return this.castToSonarDependency(queryResult);
    return new ArrayList<SonarDependency>();
  }

  private List<SonarDependency> castToSonarDependency(final List<Object[]> queryResult) {
    final List<SonarDependency> result = new ArrayList<SonarDependency>(queryResult.size());

    for (final Object[] object : queryResult) {
      final SonarDependencyBuilder dependency = new SonarDependencyBuilder();
      dependency.withId((Long) object[0]);
      dependency.withFromSnapshotId((Integer) object[1]);
      dependency.withToSnapshotId((Integer) object[2]);

      result.add(dependency.createSonarDependency());
    }

    return result;
  }

}
