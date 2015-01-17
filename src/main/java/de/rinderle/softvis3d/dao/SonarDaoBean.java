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
import de.rinderle.softvis3d.domain.Metric;
import de.rinderle.softvis3d.domain.MinMaxValue;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sonar.api.database.DatabaseSession;

import javax.persistence.PersistenceException;
import javax.persistence.Query;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * Use singleton to set the database session once on startup and to be sure that
 * it is set on any other injection.
 */
@Singleton
public class SonarDaoBean implements SonarDao {

	private static final Logger LOGGER = LoggerFactory
			.getLogger(SonarDaoBean.class);

	private DatabaseSession session;

	@Override
	public void setDatabaseSession(final DatabaseSession session) {
		this.session = session;
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<Metric> getDistinctMetricsBySnapshotId(final Integer snapshotId) {
		List<Metric> metrics = new ArrayList<Metric>();

		try {
			this.session.start();

			final Query metricsQuery = this.session
					.createNativeQuery("SELECT DISTINCT m.metric_id, metrics.description "
                  + "FROM project_measures m "
                  + "INNER JOIN snapshots s ON s.id = m.snapshot_id "
                  + "INNER JOIN metrics metrics ON metrics.id = m.metric_id "
                  + "WHERE s.root_snapshot_id = :snapshotId "
                  + "AND m.value is not null "
                  + "AND s.scope = 'FIL' "
                  + "AND metrics.description is not null "
                  + "ORDER BY m.metric_id ASC");
			metricsQuery.setParameter("snapshotId", snapshotId);

      List<Object[]> sqlResult = metricsQuery.getResultList();

			for (Object[] metric : sqlResult) {
				final Integer id = (Integer) metric[0];
				final String description = (String) metric[1];

        metrics.add(new Metric(id, description));
			}

		} catch (final PersistenceException e) {
			LOGGER.error(e.getMessage(), e);
      metrics = null;
		} finally {
			this.session.stop();
		}

		return metrics;
	}

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
	public MinMaxValue getMinMaxMetricValuesByRootSnapshotId(
			int rootSnapshotId, int metricId) {
		MinMaxValue result = null;
		try {
			this.session.start();
			final Query query = this.session
					.createNativeQuery("select MIN(m.value) as min, MAX(m.value) as max "
                  + "from snapshots s "
                  + "INNER JOIN project_measures m ON s.id = m.snapshot_id "
                  + "WHERE s.path LIKE :rootSnapshotId AND m.metric_id = :metric_id "
                  + "AND s.scope = 'FIL'");

			query.setParameter("rootSnapshotId", rootSnapshotId + ".%");
			query.setParameter("metric_id", metricId);

			final Object[] sqlResult = (Object[]) query.getSingleResult();
			final double min = ((BigDecimal) sqlResult[0]).doubleValue();
			final double max = ((BigDecimal) sqlResult[1]).doubleValue();

			result = new MinMaxValue(min, max);
		} catch (final PersistenceException e) {
			LOGGER.error(e.getMessage(), e);
		} finally {
			this.session.stop();
		}

		return result;
	}

	/**
	 * TODO: Should be done within one method for both metrics using
	 * Annotation SqlResultSetMapping. Gave it a try but didn't work as expected.
	 *
	 */
	@Override
	public List<Object[]> getAllProjectElementsWithMetric(
			final Integer rootSnapshotId, final Integer metricId) {
		List<Object[]> result;

		try {
			this.session.start();

			final String sqlQuery = "SELECT s.id, p.path, metric.value "
					+ "FROM snapshots s "
					+ "INNER JOIN projects p ON s.project_id = p.id "
					+ "LEFT JOIN project_measures metric ON s.id = metric.snapshot_id "
					+ "AND metric.metric_id = :metricId "
					+ "WHERE s.root_snapshot_id = :id AND s.qualifier = 'FIL' "
					+ "ORDER BY p.path";

			final Query query = this.session.createNativeQuery(sqlQuery);

			query.setParameter("id", rootSnapshotId);
			query.setParameter("metricId", metricId);

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
