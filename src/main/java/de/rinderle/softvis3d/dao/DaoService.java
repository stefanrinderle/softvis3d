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

import com.google.inject.Inject;
import de.rinderle.softvis3d.base.domain.MinMaxValue;
import de.rinderle.softvis3d.dao.dto.MetricResultDTO;
import de.rinderle.softvis3d.dao.scm.ScmCalculationService;
import de.rinderle.softvis3d.domain.VisualizationRequest;
import de.rinderle.softvis3d.domain.sonar.ModuleInfo;
import de.rinderle.softvis3d.domain.sonar.ScmInfoType;
import de.rinderle.softvis3d.domain.sonar.SonarDependency;
import de.rinderle.softvis3d.domain.sonar.SonarSnapshot;
import de.rinderle.softvis3d.domain.sonar.SonarSnapshotBuilder;
import java.util.ArrayList;
import java.util.List;
import org.apache.commons.lang.time.StopWatch;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sonar.api.config.Settings;

//import de.rinderle.softvis3d.dao.scm.ScmCalculationService;
//import de.rinderle.softvis3d.domain.ScmInfoType;

public class DaoService {

  static final String SCM_AUTHOR_NAME = "authors_by_line";
  private static final Logger LOGGER = LoggerFactory.getLogger(DaoService.class);
  private static final String SCM_DATE_NAME = "last_commit_datetimes_by_line";

  @Inject
  private SonarDao sonarDao;
  @Inject
  private DependencyDao dependencyDao;

  public Integer getMetric1FromSettings(final Settings settings) {
    LOGGER.debug("getMetric1FromSettings");
    return this.sonarDao.getMetricIdByKey(settings.getString("metric1"));
  }

  public Integer getMetric2FromSettings(final Settings settings) {
    LOGGER.debug("getMetric2FromSettings");
    return this.sonarDao.getMetricIdByKey(settings.getString("metric2"));
  }

  /**
   * Request all metrics which are set on the file level (Scope) for the requested root snapshot.
   *
   * @param snapshotId
   *            Root snapshot ID
   * @return defined metrics on the file level scope
   */
  public List<de.rinderle.softvis3d.base.domain.Metric> getDefinedMetricsForSnapshot(final Integer snapshotId) {
    LOGGER.debug("getDefinedMetricsForSnapshot " + snapshotId);
    return this.sonarDao.getDistinctMetricsBySnapshotId(snapshotId);
  }

  public MinMaxValue getMinMaxMetricValuesByRootSnapshotId(final int rootSnapshotId, final int metricId) {
    LOGGER.debug("getMinMaxMetricValuesByRootSnapshotId " + rootSnapshotId);
    return this.sonarDao.getMinMaxMetricValuesByRootSnapshotId(rootSnapshotId, metricId);
  }

  public boolean hasDependencies(final Integer snapshotId) {
    LOGGER.debug("hasDependencies" + snapshotId);

    final List<SonarDependency> result = getDependencies(snapshotId);

    return !result.isEmpty();
  }

  public List<ModuleInfo> getDirectModuleChildrenIds(final Integer snapshotId) {
    return this.sonarDao.getDirectModuleChildrenIds(snapshotId);
  }

  public MinMaxValue getMaxScmInfo(final VisualizationRequest requestDTO) {
    int maxScmMetricValue = 0;

    if (!ScmInfoType.NONE.equals(requestDTO.getScmInfoType())) {
      final ScmCalculationService scmCalculationService = getCalculationService(requestDTO.getScmInfoType());

      final List<MetricResultDTO<String>> scmCommitter = getScmAuthors(requestDTO.getRootSnapshotId());
      for (final MetricResultDTO<String> aScmCommitter : scmCommitter) {
        final int nodeScmMetricValue = scmCalculationService.getNodeValue(aScmCommitter.getValue(), "");

        if (nodeScmMetricValue > maxScmMetricValue) {
          maxScmMetricValue = nodeScmMetricValue;
        }
      }
    } else {
      return null;
    }

    LOGGER.info("Max scm metric value " + maxScmMetricValue);

    return new MinMaxValue(0, maxScmMetricValue);
  }

  /**
   * provide mocking of calc service.
   */
  protected ScmCalculationService getCalculationService(final ScmInfoType scmInfoType) {
    return scmInfoType.getScmCalculationService();
  }

  public List<SonarDependency> getDependencies(final Integer snapshotId) {
    LOGGER.debug("getDependencies " + snapshotId);

    final List<ModuleInfo> modules = getDirectModuleChildrenIds(snapshotId);

    List<SonarDependency> result = new ArrayList<SonarDependency>();
    if (modules == null || modules.isEmpty()) {
      result = this.dependencyDao.getDependencies(snapshotId);
    } else {
      for (final ModuleInfo module : modules) {
        result.addAll(this.dependencyDao.getDependencies(module.getId()));
      }
    }

    return result;
  }

  public List<SonarSnapshot> getFlatChildrenWithMetrics(final VisualizationRequest requestDTO) {
    final List<SonarSnapshot> result = new ArrayList<SonarSnapshot>();

    final StopWatch stopWatch = new StopWatch();
    stopWatch.start();

    final List<MetricResultDTO<Integer>> snapshots = sonarDao.getAllSnapshotIdsWithRescourceId(
      requestDTO.getRootSnapshotId());

    for (final MetricResultDTO<Integer> snapshot : snapshots) {
      final Integer snapshotId = snapshot.getId();
      final SonarSnapshotBuilder builder = new SonarSnapshotBuilder(snapshotId);

      builder.withPath(sonarDao.getResourcePath(snapshot.getValue()));
      builder.withFootprintMeasure(sonarDao.getMetricDouble(requestDTO.getFootprintMetricId(), snapshotId));
      builder.withHeightMeasure(sonarDao.getMetricDouble(requestDTO.getHeightMetricId(), snapshotId));

      if (!ScmInfoType.NONE.equals(requestDTO.getScmInfoType())) {
        int scmMetric = getScmMetric(snapshotId, requestDTO.getScmInfoType());
        builder.withScmMetric(scmMetric);
      }

      final SonarSnapshot snapshotResult = builder.build();

      result.add(snapshotResult);
    }

    stopWatch.stop();
    LOGGER.info("Time for getting snapshots " + stopWatch.getTime() + " ms");

    return result;
  }

  /**
   * TODO does not yet work.
   * Get the first children and check if the metric is available or create
   * dedicated sql statement --> webservice call in the future.
   */
  public boolean hasScmInfos(Integer rootSnapshotId) {
    return true;
  }

  private int getScmMetric(final Integer snapshotId, final ScmInfoType scmInfoType) {
    final Integer authorDateMetricId = this.sonarDao.getMetricIdByKey(SCM_DATE_NAME);
    final String authorDateMetric = this.sonarDao.getMetricText(authorDateMetricId, snapshotId);

    final String authors = getAuthors(snapshotId);
    return getCalculationService(scmInfoType).getNodeValue(authors, authorDateMetric);
  }

  private String getAuthors(final Integer snapshotId) {
    final Integer authorMetricId = this.sonarDao.getMetricIdByKey(SCM_AUTHOR_NAME);
    return this.sonarDao.getMetricText(authorMetricId, snapshotId);
  }

  private List<MetricResultDTO<String>> getScmAuthors(final int rootSnapshotId) {
    final Integer authorMetricId = this.sonarDao.getMetricIdByKey(SCM_AUTHOR_NAME);

    return this.sonarDao.getMetricTextForAllProjectElementsWithMetric(rootSnapshotId, authorMetricId);
  }

}
