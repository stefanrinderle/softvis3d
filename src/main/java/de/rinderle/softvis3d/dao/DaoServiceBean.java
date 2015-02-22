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
import de.rinderle.softvis3d.dao.dto.MetricResultDTO;
import de.rinderle.softvis3d.domain.sonar.SonarSnapshotBuilder;
import de.rinderle.softvis3d.domain.MinMaxValue;
import de.rinderle.softvis3d.domain.VisualizationRequest;
import de.rinderle.softvis3d.domain.sonar.ModuleInfo;
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

  private static final String SCM_AUTHOR_NAME = "authors_by_line";
  private static final String SCM_DATE_NAME = "last_commit_datetimes_by_line";

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
	public List<de.rinderle.softvis3d.domain.Metric> getDefinedMetricsForSnapshot(final Integer snapshotId) {
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
  public boolean hasDependencies(Integer snapshotId) {
    LOGGER.debug("hasDependencies" + snapshotId);

    final List<SonarDependency> result = getDependencies(snapshotId);

    return result.size() > 0;
  }

  @Override
  public List<ModuleInfo> getDirectModuleChildrenIds(Integer snapshotId) {
    return this.sonarDao.getDirectModuleChildrenIds(snapshotId);
  }

  @Override
	public List<SonarDependency> getDependencies(Integer snapshotId) {
		LOGGER.debug("getDependencies " + snapshotId);

    List<ModuleInfo> modules = getDirectModuleChildrenIds(snapshotId);

    List<SonarDependency> result = new ArrayList<SonarDependency>();
    if (modules == null || modules.size() == 0) {
      result = this.dependencyDao.getDependencies(snapshotId);
    } else {
      for (ModuleInfo module : modules) {
        result.addAll(this.dependencyDao.getDependencies(module.getId()));
      }
    }

		return result;
	}

	@Override
	public List<SonarSnapshot> getFlatChildrenWithMetrics(
			final VisualizationRequest requestDTO) {
		final List<SonarSnapshot> result = new ArrayList<SonarSnapshot>();

    final List<MetricResultDTO<String>> resultPath = getProjectElements(requestDTO);

    final List<MetricResultDTO<BigDecimal>> resultFootprintMetric = getFootprintMetric(requestDTO);
    final List<MetricResultDTO<BigDecimal>> resultHeightMetric = getHeightMetric(requestDTO);
    final List<MetricResultDTO<String>> scmCommitter = getScmCommitter(requestDTO.getRootSnapshotId());
    final List<MetricResultDTO<String>> scmTime = getScmTime(requestDTO.getRootSnapshotId());

    // join result lists
		for (int i = 0; i < resultPath.size(); i = i + 1) {

			final int id = resultPath.get(i).getId();
			final String path = resultPath.get(i).getValue();

      SonarSnapshotBuilder builder =
              new SonarSnapshotBuilder(id, path)
              .footprintMetricValue(resultFootprintMetric.get(i).getValue())
              .heightMetricValue(resultHeightMetric.get(i).getValue())
              .scmInfo(scmCommitter.get(i).getValue(), scmTime.get(i).getValue());

      SonarSnapshot snapshotResult = builder.build();

//      LOGGER.info(snapshotResult.getAuthorCount() + "");

			result.add(snapshotResult);
		}

		return result;

	}

  private List<MetricResultDTO<String>> getScmTime(int rootSnapshotId) {
    final Integer authorMetricId = this.sonarDao.getMetricIdByName(SCM_DATE_NAME);

    return this.sonarDao
            .getMetricTextForAllProjectElementsWithMetric(
                    rootSnapshotId,
                    authorMetricId);
  }

  private List<MetricResultDTO<String>> getScmCommitter(int rootSnapshotId) {
    final Integer authorMetricId = this.sonarDao.getMetricIdByName(SCM_AUTHOR_NAME);

    return this.sonarDao
            .getMetricTextForAllProjectElementsWithMetric(
                    rootSnapshotId,
                    authorMetricId);
  }

  private List<MetricResultDTO<String>> getProjectElements(VisualizationRequest requestDTO) {
    return this.sonarDao
              .getAllProjectElementsWithPath(requestDTO.getRootSnapshotId());
  }

  private List<MetricResultDTO<BigDecimal>> getFootprintMetric(VisualizationRequest requestDTO) {
    return this.sonarDao
          .getAllProjectElementsWithMetric(
                  requestDTO.getRootSnapshotId(),
                  requestDTO.getFootprintMetricId());
  }

  private List<MetricResultDTO<BigDecimal>> getHeightMetric(VisualizationRequest requestDTO) {
    return this.sonarDao
          .getAllProjectElementsWithMetric(
                  requestDTO.getRootSnapshotId(),
                  requestDTO.getHeightMetricId());
  }


}
