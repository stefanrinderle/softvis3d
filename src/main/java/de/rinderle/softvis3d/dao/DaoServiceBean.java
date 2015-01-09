/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.dao;

import com.google.inject.Inject;
import de.rinderle.softvis3d.domain.MinMaxValue;
import de.rinderle.softvis3d.domain.VisualizationRequest;
import de.rinderle.softvis3d.domain.sonar.SonarDependency;
import de.rinderle.softvis3d.domain.sonar.SonarSnapshot;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sonar.api.config.Settings;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class DaoServiceBean implements DaoService {

	private static final Logger LOGGER = LoggerFactory
			.getLogger(DaoServiceBean.class);

	@Inject
	private SonarDao sonarDao;
	@Inject
	private DependencyDao dependencyDao;

	@Override
	public Integer getMetric1FromSettings(final Settings settings) {
		LOGGER.debug("getMetric1FromSettings");
		return this.sonarDao.getMetricIdByName(settings.getString("metric1"));
	}

	@Override
	public Integer getMetric2FromSettings(final Settings settings) {
		LOGGER.debug("getMetric2FromSettings");
		return this.sonarDao.getMetricIdByName(settings.getString("metric2"));
	}

	@Override
	public List<Integer> getDefinedMetricsForSnapshot(final Integer snapshotId) {
		LOGGER.debug("getDefinedMetricsForSnapshot " + snapshotId);
		return this.sonarDao.getDistinctMetricsBySnapshotId(snapshotId);
	}

	@Override
	public MinMaxValue getMinMaxMetricValuesByRootSnapshotId(
			int rootSnapshotId, int metricId) {
		LOGGER.debug("getMinMaxMetricValuesByRootSnapshotId " + rootSnapshotId);
		return this.sonarDao.getMinMaxMetricValuesByRootSnapshotId(
				rootSnapshotId, metricId);

	}

	@Override
	public List<SonarDependency> getDependencies(Integer snapshotId) {
		LOGGER.debug("getDependencies " + snapshotId);
		return this.dependencyDao.getDependencies(snapshotId);
	}

	@Override
	public List<SonarSnapshot> getFlatChildrenWithMetrics(
			final VisualizationRequest requestDTO) {
		final List<SonarSnapshot> result = new ArrayList<SonarSnapshot>();

		final List<Object[]> resultFootprintMetric = this.sonarDao
				.getAllProjectElementsWithMetric(
						requestDTO.getRootSnapshotId(),
						requestDTO.getFootprintMetricId());
		final List<Object[]> resultHeightMetric = this.sonarDao
				.getAllProjectElementsWithMetric(
						requestDTO.getRootSnapshotId(),
						requestDTO.getHeightMetricId());

		// join result lists
		for (int i = 0; i < resultFootprintMetric.size(); i = i + 1) {
			final int id = (Integer) resultFootprintMetric.get(i)[0];
			final String path = (String) resultFootprintMetric.get(i)[1];
			BigDecimal footprintMetricValue = (BigDecimal) resultFootprintMetric
					.get(i)[2];
			BigDecimal heightMetricValue = (BigDecimal) resultHeightMetric
					.get(i)[2];

			if (footprintMetricValue == null) {
				footprintMetricValue = BigDecimal.ZERO;
			}

			// check for null values
			if (heightMetricValue == null) {
				heightMetricValue = BigDecimal.ZERO;
			}

			final SonarSnapshot element = new SonarSnapshot(id, path,
					footprintMetricValue.doubleValue(),
					heightMetricValue.doubleValue());

			result.add(element);
		}

		return result;

	}

}
