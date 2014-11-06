/*
 * SoftViz3d Sonar plugin
 * Copyright (C) 2013 Stefan Rinderle
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
package de.rinderle.softviz3d.sonar;

import com.google.inject.Singleton;
import de.rinderle.softviz3d.dto.SonarDependencyDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sonar.api.database.DatabaseSession;

import javax.persistence.PersistenceException;
import javax.persistence.Query;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;

/**
 * Use singleton to set the database session once on startup
 * and to be sure that it is set on any other injection.
 */
@Singleton
public class DependencyDaoImpl implements DependencyDao {

  private static final Logger LOGGER = LoggerFactory
    .getLogger(DependencyDaoImpl.class);

  private DatabaseSession session;

  @Override
  public void setDatabaseSession(final DatabaseSession session) {
    this.session = session;
  }

  @Override
  public List<SonarDependencyDTO> getDependencies(final Integer projectSnapshotId) {
    List<SonarDependencyDTO> result = null;

    try {
      this.session.start();
      final Query query = this.session
        .createNativeQuery("SELECT * FROM dependencies d WHERE project_snapshot_id = :projectSnapshotId");

      query.setParameter("projectSnapshotId", projectSnapshotId);

      final List<Object[]> queryResult = (List<Object[]>) query.getResultList();

      result = this.castToSonarDependency(queryResult);

    } catch (final PersistenceException e) {
      LOGGER.error(e.getMessage(), e);
    } finally {
      this.session.stop();
    }

    return result;
  }

  private List<SonarDependencyDTO> castToSonarDependency(final List<Object[]> queryResult) {
    final List<SonarDependencyDTO> result = new ArrayList<SonarDependencyDTO>(queryResult.size());

    for (final Object[] object : queryResult) {
      final SonarDependencyDTO dependency = new SonarDependencyDTO();
      dependency.setId((BigInteger) object[0]);
      dependency.setFromSnapshotId((Integer) object[1]);
      dependency.setFromResourceId((Integer) object[2]);
      dependency.setToSnapshotId((Integer) object[3]);
      dependency.setToResourceId((Integer) object[4]);

      result.add(dependency);
    }

    return result;
  }

}
