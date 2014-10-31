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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sonar.api.database.DatabaseSession;

import javax.persistence.PersistenceException;
import javax.persistence.Query;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Singleton
public class SonarDaoImpl implements SonarDao {

  private static final Logger LOGGER = LoggerFactory
    .getLogger(SonarDaoImpl.class);

  private DatabaseSession session;

  @Override
  public void setDatabaseSession(final DatabaseSession session) {
    this.session = session;
  }

  @SuppressWarnings("unchecked")
  @Override
  public List<Integer> getDistinctMetricsBySnapshotId(final Integer snapshotId) {
    List<Integer> metricIds;

    try {
      this.session.start();

      final Query metricsQuery = this.session
        .createQuery("SELECT distinct metricId "
          + "FROM MeasureModel m WHERE m.snapshotId = :snapshotId "
          + "AND m.value is not null");
      metricsQuery.setParameter("snapshotId", snapshotId);

      metricIds = metricsQuery.getResultList();
    } catch (final PersistenceException e) {
      LOGGER.error(e.getMessage(), e);
      metricIds = null;
    } finally {
      this.session.stop();
    }

    return metricIds;
  }

  /*
   * (non-Javadoc)
   * 
   * @see
   * de.rinderle.softviz3d.sonar.SonarDaoInterface#getMetricIdByName(java.
   * lang.String)
   */
  @Override
  public Integer getMetricIdByName(final String name) {
    Integer metricId;

    try {
      this.session.start();
      final Query query = this.session
        .createNativeQuery("SELECT id FROM metrics m WHERE m.name = :name");
      query.setParameter("name", name);

      metricId = (Integer) query.getSingleResult();
    } catch (final PersistenceException e) {
      LOGGER.error(e.getMessage(), e);
      metricId = null;
    } finally {
      this.session.stop();
    }

    return metricId;
  }

  @Override
  public List<Double> getMinMaxMetricValuesByRootSnapshotId(
    final Integer rootSnapshotId, final Integer footprintMetricId,
    final Integer heightMetricId) {
    List<Double> values = new ArrayList<Double>();

    try {
      this.session.start();
      final Query query = this.session
        .createNativeQuery("select MIN(m1.value) as min1, MAX(m1.value) as max1, "
          + "MIN(m2.value) as min2, MAX(m2.value) as max2 from snapshots s "
          + "INNER JOIN project_measures m1 ON s.id = m1.snapshot_id "
          + "INNER JOIN project_measures m2 ON s.id = m2.snapshot_id "
          + "WHERE s.path LIKE :rootSnapshotId AND m1.metric_id = :footprintMetricId AND "
          + "m2.metric_id = :heightMetricId AND "
          + "s.scope != 'PRJ' AND s.scope != 'DIR'");
      query.setParameter("rootSnapshotId", rootSnapshotId + ".%");
      query.setParameter("footprintMetricId", footprintMetricId);
      query.setParameter("heightMetricId", heightMetricId);

      final Object[] result = (Object[]) query.getSingleResult();
      values.add(((BigDecimal) result[0]).doubleValue());
      values.add(((BigDecimal) result[1]).doubleValue());
      values.add(((BigDecimal) result[2]).doubleValue());
      values.add(((BigDecimal) result[3]).doubleValue());

    } catch (final PersistenceException e) {
      LOGGER.error(e.getMessage(), e);
      values = null;
    } finally {
      this.session.stop();
    }

    return values;
  }

  @Override
  public List<Object[]> getAllProjectElements(final int rootSnapshotId,
    final int footprintMetricId, final int heightMetricId) {
    List<Object[]> result;

    try {
      this.session.start();
      final Query query = this.session
        .createNativeQuery(
        "SELECT s.id, p.path, m1.value, m2.value " +
          "FROM snapshots s " +
          "INNER JOIN projects p ON s.project_id = p.id " +
          "INNER JOIN project_measures m1 ON s.id = m1.snapshot_id " +
          "INNER JOIN project_measures m2 ON s.id = m2.snapshot_id " +
          "WHERE m1.metric_id = :footprintMetricId " +
          "AND m2.metric_id = :heightMetricId " +
          "AND s.root_snapshot_id = :id " +
          "ORDER BY p.path");
      query.setParameter("id", rootSnapshotId);
      query.setParameter("footprintMetricId", footprintMetricId);
      query.setParameter("heightMetricId", heightMetricId);

      result = query.getResultList();
    } catch (final PersistenceException e) {
      LOGGER.error(e.getMessage(), e);
      result = null;
    } finally {
      this.session.stop();
    }

    // The sql obove does not work as expected. object[2] == object[3] which means
    // that java is not able to differentiate m1.value from m2.value.
    // Therfore the heightMetricValues has to selected separately and override the result.
    final List<Object[]> heightResults = this.getHeightMetrics(rootSnapshotId, heightMetricId);
    for (final Object[] heightResult : heightResults) {
      final int index = heightResults.indexOf(heightResult);
      result.get(index)[3] = heightResults.get(index)[1];
    }

    return result;
  }

  private List<Object[]> getHeightMetrics(final Integer rootSnapshotId, final Integer heightMetricId) {
    List<Object[]> result;

    try {
      this.session.start();
      final Query query = this.session
        .createNativeQuery(
        "SELECT s.id, m1.value, p.path " +
          "FROM snapshots s " +
          "INNER JOIN projects p ON s.project_id = p.id " +
          "INNER JOIN project_measures m1 ON s.id = m1.snapshot_id " +
          "WHERE m1.metric_id = :heightMetricId " +
          "AND s.root_snapshot_id = :id " +
          "ORDER BY p.path");
      query.setParameter("id", rootSnapshotId);
      query.setParameter("heightMetricId", heightMetricId);

      result = query.getResultList();
    } catch (final PersistenceException e) {
      LOGGER.error(e.getMessage(), e);
      result = null;
    } finally {
      this.session.stop();
    }

    return result;
  }
}
