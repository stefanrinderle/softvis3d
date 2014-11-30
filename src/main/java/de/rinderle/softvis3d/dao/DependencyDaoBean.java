/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.dao;

import com.google.inject.Singleton;
import de.rinderle.softvis3d.domain.sonar.SonarDependency;
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
public class DependencyDaoBean implements DependencyDao {

  private static final Logger LOGGER = LoggerFactory
    .getLogger(DependencyDaoBean.class);

  private DatabaseSession session;

  @Override
  public void setDatabaseSession(final DatabaseSession session) {
    this.session = session;
  }

  @Override
  public List<SonarDependency> getDependencies(final Integer projectSnapshotId) {
    List<SonarDependency> result = null;

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

  private List<SonarDependency> castToSonarDependency(final List<Object[]> queryResult) {
    final List<SonarDependency> result = new ArrayList<SonarDependency>(queryResult.size());

    for (final Object[] object : queryResult) {
      final SonarDependency dependency = new SonarDependency();
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
