/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.dao;

import com.google.common.collect.Maps;
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

import javax.persistence.Query;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Use singleton to set the database session once on startup and to be sure that it is set on any other injection.
 */
@Singleton
public class SonarDaoBean implements SonarDao {

    private static final Logger LOGGER = LoggerFactory.getLogger(SonarDaoBean.class);

    private DatabaseSession session;

    @Override
    public void setDatabaseSession(final DatabaseSession session) {
        this.session = session;
    }

    @SuppressWarnings("unchecked")
    @Override
    public List<Metric> getDistinctMetricsBySnapshotId(final Integer snapshotId) {
        // TODO: check if the metric is defined for that snapshot id.

        List<Metric> metrics = new ArrayList<Metric>();

        List<org.sonar.api.measures.Metric> metricsTest = session.getResults(org.sonar.api.measures.Metric.class);
        for (org.sonar.api.measures.Metric metrictemp : metricsTest) {
          if (metrictemp.isNumericType() && !metrictemp.isHidden() && metrictemp.getEnabled()) {
            metrics.add(new Metric(metrictemp.getId(), metrictemp.getName()));
          }
        }

        return metrics;
    }

    @SuppressWarnings("unchecked")
    @Override
    public List<ModuleInfo> getDirectModuleChildrenIds(final Integer snapshotId) {
        final List<ModuleInfo> result = new ArrayList<ModuleInfo>();

        final List<Snapshot> snapshots = session.getResults(Snapshot.class,
                "parentId", snapshotId, "qualifier", Qualifiers.MODULE);

        for (Snapshot snapshot : snapshots) {
          final ResourceModel resource =
                  this.session.getSingleResult(ResourceModel.class, "id", snapshot.getResourceId());

          result.add(new ModuleInfo(snapshot.getId(), resource.getName()));
        }


        return result;
    }

    @Override
    public Integer getMetricIdByKey(final String key) {
      org.sonar.api.measures.Metric result =
              this.session.getSingleResult(org.sonar.api.measures.Metric.class, "key", key);

        return result.getId();
    }

    @Override
    public MinMaxValue getMinMaxMetricValuesByRootSnapshotId(int rootSnapshotId, int metricId) {
        final StringBuilder sb = new StringBuilder();

        sb.append("SELECT MIN(m.value), MAX(m.value) ");
        sb.append(" FROM ")
                .append(MeasureModel.class.getSimpleName())
                .append(" m, ")
                .append(Snapshot.class.getSimpleName())
                .append(" s WHERE m.snapshotId=s.id ")
                .append("AND (s.path LIKE :idRoot OR s.path LIKE :idModule) AND ")
                .append("m.metricId =:metric_id AND s.scope = 'FIL'");

        Query jpaQuery = session.createQuery(sb.toString());

        jpaQuery.setParameter("idRoot", rootSnapshotId + ".%");
        jpaQuery.setParameter("idModule", "%." + rootSnapshotId + ".%");
        jpaQuery.setParameter("metric_id", metricId);

        final Object[] result = (Object[]) jpaQuery.getSingleResult();
        return new MinMaxValue((Double) result[0], (Double) result[1]);
    }

    @Override
    public List<MetricResultDTO<String>> getAllProjectElementsWithPath(final Integer rootSnapshotId) {
        List<MetricResultDTO<String>> result = new ArrayList<MetricResultDTO<String>>();

        final String sqlQuery =
                "SELECT s.id, p.path FROM snapshots s INNER JOIN projects p ON s.project_id = p.id "
                        + "WHERE (s.path LIKE :idRoot OR s.path LIKE :idModule) AND s.qualifier = 'FIL' " + "ORDER BY"
                        + " p.path";

        final Query query = this.session.createNativeQuery(sqlQuery);

        query.setParameter("idRoot", rootSnapshotId + ".%");
        query.setParameter("idModule", "%." + rootSnapshotId + ".%");

        List<Object[]> sqlResult = query.getResultList();

        for (Object[] aSqlResult : sqlResult) {
            result.add(new MetricResultDTO<String>((Integer) aSqlResult[0], (String) aSqlResult[1]));
        }

        return result;
    }

    @Override
    public List<MetricResultDTO<Double>> getAllProjectElementsWithMetric(final Integer rootSnapshotId,
            final Integer metricId) {

        List<MetricResultDTO<Double>> result = new ArrayList<MetricResultDTO<Double>>();

        final String sqlQuery =
                "SELECT s.id, metric.value FROM snapshots s INNER JOIN projects p ON s.project_id = p.id "
                        + "LEFT JOIN project_measures metric ON s.id = metric.snapshot_id "
                        + "AND metric.metric_id = :metricId "
                        + "WHERE (s.path LIKE :idRoot OR s.path LIKE :idModule) AND s.qualifier = 'FIL' "
                        + "ORDER BY p.path";

        final Query query = this.session.createNativeQuery(sqlQuery);

        query.setParameter("idRoot", rootSnapshotId + ".%");
        query.setParameter("idModule", "%." + rootSnapshotId + ".%");

        query.setParameter("metricId", metricId);

        List<Object[]> sqlResult = query.getResultList();

        for (Object[] aSqlResult : sqlResult) {
            if (aSqlResult[1] == null) {
              result.add(new MetricResultDTO<Double>((Integer) aSqlResult[0], 0.0));
            } else {
              result.add(new MetricResultDTO<Double>((Integer) aSqlResult[0],
                      ((BigDecimal) aSqlResult[1]).doubleValue()));
            }
        }

        return result;
    }

    @Override
    public List<MetricResultDTO<String>> getMetricTextForAllProjectElementsWithMetric(final Integer rootSnapshotId,
            final Integer metricId) {
        List<MetricResultDTO<String>> result = new ArrayList<MetricResultDTO<String>>();

        final String sqlQuery =
                "SELECT s.id, metric.text_value FROM snapshots s "
                        + "INNER JOIN projects p ON s.project_id = p.id "
                        + "LEFT JOIN project_measures metric ON s.id = metric.snapshot_id "
                        + "AND metric.metric_id = :metricId WHERE(s.path LIKE :idRoot OR s.path LIKE :idModule) "
                        + "AND s.qualifier = 'FIL' "
                        + "ORDER BY p.path";

        final Query query = this.session.createNativeQuery(sqlQuery);

        query.setParameter("idRoot", rootSnapshotId + ".%");
        query.setParameter("idModule", "%." + rootSnapshotId + ".%");

        query.setParameter("metricId", metricId);

        List<Object[]> sqlResult = query.getResultList();

        for (Object[] aSqlResult : sqlResult) {
            result.add(new MetricResultDTO<String>((Integer) aSqlResult[0], (String) aSqlResult[1]));
        }

        return result;
    }

    @Override
    public BigInteger getScmInfoMetricId(final String name) {
      final Query query =
              this.session.createNativeQuery("SELECT m.id FROM metrics m WHERE s.name = :scmInfoName");

      query.setParameter("scmInfoName", name);

      return (BigInteger) query.getSingleResult();
    }
}
