/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
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

import javax.persistence.PersistenceException;
import javax.persistence.Query;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;

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
        List<Metric> metrics = new ArrayList<Metric>();

        final Query metricsQuery =
                this.session.createNativeQuery("SELECT DISTINCT m.metric_id, metrics.description "
                        + "FROM project_measures m INNER JOIN snapshots s ON s.id = m.snapshot_id "
                        + "INNER JOIN metrics metrics ON metrics.id = m.metric_id "
                        + "WHERE (s.path LIKE :idRoot OR s.path LIKE :idModule) AND m.value is not null "
                        + "AND s.scope = 'FIL' AND metrics.description is not null ORDER BY m.metric_id ASC");

        metricsQuery.setParameter("idRoot", snapshotId + ".%");
        metricsQuery.setParameter("idModule", "%." + snapshotId + ".%");

        List<Object[]> sqlResult = metricsQuery.getResultList();

        for (Object[] metric : sqlResult) {
            final Integer id = (Integer) metric[0];
            final String description = (String) metric[1];

            metrics.add(new Metric(id, description));
        }

        return metrics;
    }

    @Override
    public BigInteger getScmInfoMetricId(final String name) {
        final Query query =
                this.session.createNativeQuery("SELECT m.id FROM metrics m WHERE s.name = :scmInfoName");

        query.setParameter("scmInfoName", name);

        return (BigInteger) query.getSingleResult();
    }

    @SuppressWarnings("unchecked")
    @Override
    public List<ModuleInfo> getDirectModuleChildrenIds(final Integer snapshotId) {
        final List<ModuleInfo> result = new ArrayList<ModuleInfo>();

        final Query query =
                this.session.createNativeQuery("SELECT s.id, p.long_name FROM snapshots s "
                        + "INNER JOIN projects p ON s.project_id = p.id "
                        + "WHERE s.path LIKE :snapshotId and s.qualifier = 'BRC'");

        query.setParameter("snapshotId", snapshotId + ".%");

        List<Object[]> sqlResult = query.getResultList();

        for (Object[] info : sqlResult) {
            final Integer id = (Integer) info[0];
            final String name = (String) info[1];

            result.add(new ModuleInfo(id, name));
        }

        return result;
    }

    @Override
    public Integer getMetricIdByName(final String name) {
        final Query query = this.session.createNativeQuery("SELECT id FROM metrics m WHERE m.name = :name");
        query.setParameter("name", name);

        return (Integer) query.getSingleResult();
    }

    @Override
    public MinMaxValue getMinMaxMetricValuesByRootSnapshotId(int rootSnapshotId, int metricId) {
        final Query query =
                this.session.createNativeQuery("select MIN(m.value) as min, MAX(m.value) as max from snapshots s "
                        + "INNER JOIN project_measures m ON s.id = m.snapshot_id "
                        + "WHERE (s.path LIKE :idRoot OR s.path LIKE :idModule) AND m.metric_id = :metric_id AND s.scope = 'FIL'");

        query.setParameter("idRoot", rootSnapshotId + ".%");
        query.setParameter("idModule", "%." + rootSnapshotId + ".%");

        query.setParameter("metric_id", metricId);

        final Object[] sqlResult = (Object[]) query.getSingleResult();
        final double min = ((BigDecimal) sqlResult[0]).doubleValue();
        final double max = ((BigDecimal) sqlResult[1]).doubleValue();

        return new MinMaxValue(min, max);
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
    public List<MetricResultDTO<BigDecimal>> getAllProjectElementsWithMetric(final Integer rootSnapshotId,
            final Integer metricId) {
        List<MetricResultDTO<BigDecimal>> result = new ArrayList<MetricResultDTO<BigDecimal>>();

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
            result.add(new MetricResultDTO<BigDecimal>((Integer) aSqlResult[0], (BigDecimal) aSqlResult[1]));
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
}
