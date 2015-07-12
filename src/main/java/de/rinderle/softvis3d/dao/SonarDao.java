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
package de.rinderle.softvis3d.dao;

import com.google.inject.Singleton;
import de.rinderle.softvis3d.dao.dto.MetricResultDTO;
import de.rinderle.softvis3d.domain.Metric;
import de.rinderle.softvis3d.domain.MinMaxValue;
import de.rinderle.softvis3d.domain.sonar.ModuleInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sonar.api.database.DatabaseSession;
import org.sonar.api.database.model.MeasureModel;
import org.sonar.api.database.model.ResourceModel;
import org.sonar.api.database.model.Snapshot;
import org.sonar.api.resources.Qualifiers;

import javax.persistence.NoResultException;
import javax.persistence.Query;

import java.util.ArrayList;
import java.util.List;

/**
 * Use singleton to set the database session once on startup and to be sure that it is set on any other injection.
 */
@Singleton
public class SonarDao {

  private static final Logger LOGGER = LoggerFactory.getLogger(SonarDao.class);

  private DatabaseSession session;

  public void setDatabaseSession(final DatabaseSession session) {
    this.session = session;
  }

  @SuppressWarnings("unchecked")
  public List<Metric> getDistinctMetricsBySnapshotId(final Integer snapshotId) {
    // TODO: check if the metric is defined for that snapshot id.

    final List<Metric> metrics = new ArrayList<Metric>();

    final List<org.sonar.api.measures.Metric> metricsTest = session.getResults(org.sonar.api.measures.Metric.class);
    for (final org.sonar.api.measures.Metric metrict : metricsTest) {
      if (metrict.isNumericType() && !metrict.isHidden() && metrict.getEnabled()) {
        metrics.add(new Metric(metrict.getId(), metrict.getName()));
      }
    }

    return metrics;
  }

  @SuppressWarnings("unchecked")
  public List<ModuleInfo> getDirectModuleChildrenIds(final Integer snapshotId) {
    final List<ModuleInfo> result = new ArrayList<ModuleInfo>();

    final List<Snapshot> snapshots = session.getResults(Snapshot.class,
      "parentId", snapshotId, "qualifier", Qualifiers.MODULE);

    for (final Snapshot snapshot : snapshots) {
      final ResourceModel resource =
        this.session.getSingleResult(ResourceModel.class, "id", snapshot.getResourceId());

      result.add(new ModuleInfo(snapshot.getId(), resource.getName()));
    }

    return result;
  }

  public Integer getMetricIdByKey(final String key) {
    final org.sonar.api.measures.Metric result =
      this.session.getSingleResult(org.sonar.api.measures.Metric.class, "key", key);

    return result.getId();
  }

  public MinMaxValue getMinMaxMetricValuesByRootSnapshotId(final int rootSnapshotId, final int metricId) {
    final StringBuilder sb = new StringBuilder();

    sb.append("SELECT MIN(m.value), MAX(m.value) ");
    sb.append(" FROM ")
      .append(MeasureModel.class.getSimpleName())
      .append(" m, ")
      .append(Snapshot.class.getSimpleName())
      .append(" s WHERE m.snapshotId=s.id ")
      .append("AND (s.path LIKE :idRoot OR s.path LIKE :idModule) AND ")
      .append("m.metricId =:metric_id AND s.scope = 'FIL'");

    final Query jpaQuery = session.createQuery(sb.toString());

    jpaQuery.setParameter("idRoot", rootSnapshotId + ".%");
    jpaQuery.setParameter("idModule", "%." + rootSnapshotId + ".%");
    jpaQuery.setParameter("metric_id", metricId);

    final Object[] result = (Object[]) jpaQuery.getSingleResult();
    return new MinMaxValue((Double) result[0], (Double) result[1]);
  }

  public List<MetricResultDTO<Integer>> getAllSnapshotIdsWithRescourceId(final Integer rootSnapshotId) {
    final String sqlQuery =
      "SELECT s.id, s.resourceId FROM " + Snapshot.class.getSimpleName() + " s "
        + "WHERE (s.path LIKE :idRoot OR s.path LIKE :idModule) AND s.qualifier = 'FIL' ";

    final Query query = this.session.createQuery(sqlQuery);

    query.setParameter("idRoot", rootSnapshotId + ".%");
    query.setParameter("idModule", "%." + rootSnapshotId + ".%");

    final List<Object[]> sqlResult = query.getResultList();

    final List<MetricResultDTO<Integer>> result = new ArrayList<MetricResultDTO<Integer>>();
    for (final Object[] aSqlResult : sqlResult) {
      result.add(new MetricResultDTO<Integer>((Integer) aSqlResult[0], (Integer) aSqlResult[1]));
    }

    return result;
  }

  public List<MetricResultDTO<String>> getMetricTextForAllProjectElementsWithMetric(final Integer rootSnapshotId,
    final Integer metricId) {
    final StringBuilder sb = new StringBuilder();

    sb.append("SELECT s.id, m.textValue ");
    sb.append(" FROM ")
      .append(MeasureModel.class.getSimpleName())
      .append(" m, ")
      .append(Snapshot.class.getSimpleName())
      .append(" s WHERE m.snapshotId=s.id ")
      .append("AND (s.path LIKE :idRoot OR s.path LIKE :idModule) AND ")
      .append("m.metricId =:metric_id AND s.scope = 'FIL'");

    final Query jpaQuery = session.createQuery(sb.toString());

    jpaQuery.setParameter("idRoot", rootSnapshotId + ".%");
    jpaQuery.setParameter("idModule", "%." + rootSnapshotId + ".%");
    jpaQuery.setParameter("metric_id", metricId);

    final List<Object[]> sqlResult = jpaQuery.getResultList();

    final List<MetricResultDTO<String>> result = new ArrayList<MetricResultDTO<String>>();
    for (final Object[] aSqlResult : sqlResult) {
      result.add(new MetricResultDTO<String>((Integer) aSqlResult[0], (String) aSqlResult[1]));
    }

    return result;
  }

  public String getResourcePath(final Integer resourceId) {
    final String sqlQuery =
      "SELECT r.path FROM " + ResourceModel.class.getSimpleName() + " r "
        + "WHERE r.id = :resourceId";

    final Query query = this.session.createQuery(sqlQuery);
    query.setParameter("resourceId", resourceId);

    final String result = (String) query.getSingleResult();
    return result;
  }

  public Double getMetricDouble(final int metricId, final Integer snapshotId) {
    final String sqlQuery =
      "SELECT m.value FROM " + MeasureModel.class.getSimpleName() + " m "
        + "WHERE m.snapshotId = :snapshotId AND m.metricId = :metricId";

    final Query query = this.session.createQuery(sqlQuery);
    query.setParameter("snapshotId", snapshotId);
    query.setParameter("metricId", metricId);

    try {
      return (Double) query.getSingleResult();
    } catch (final NoResultException e) {
      LOGGER.debug(
        "getMetricDouble for metricId " + metricId + " and snapshotId " + snapshotId + ": " + e.getMessage(), e);
      return 0.0;
    }
  }

  public String getMetricText(final int metricId, final Integer snapshotId) {
    final String sqlQuery =
      "SELECT m.textValue FROM " + MeasureModel.class.getSimpleName() + " m "
        + "WHERE m.snapshotId = :snapshotId AND m.metricId = :metricId";

    final Query query = this.session.createQuery(sqlQuery);
    query.setParameter("snapshotId", snapshotId);
    query.setParameter("metricId", metricId);

    try {
      return (String) query.getSingleResult();
    } catch (final NoResultException e) {
      LOGGER.error(
        "getMetricText for metricId " + metricId + " and snapshotId " + snapshotId + ": " + e.getMessage(), e);
      return null;
    }
  }

}
