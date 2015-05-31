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
import de.rinderle.softvis3d.dao.dto.MetricResultDTO;
import de.rinderle.softvis3d.domain.MinMaxValue;
import de.rinderle.softvis3d.domain.VisualizationRequest;
import de.rinderle.softvis3d.domain.sonar.ModuleInfo;
import de.rinderle.softvis3d.domain.sonar.SonarDependency;
import de.rinderle.softvis3d.domain.sonar.SonarSnapshot;
import de.rinderle.softvis3d.domain.sonar.SonarSnapshotBuilder;
import org.apache.commons.lang.time.StopWatch;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sonar.api.config.Settings;

import java.util.ArrayList;
import java.util.List;

public class DaoServiceBean implements DaoService {

  private static final Logger LOGGER = LoggerFactory.getLogger(DaoServiceBean.class);

  private static final String SCM_AUTHOR_NAME = "authors_by_line";
  // private static final String SCM_DATE_NAME = "last_commit_datetimes_by_line";

  @Inject
  private SonarDao sonarDao;
  @Inject
  private DependencyDao dependencyDao;
  @Inject
  private ScmCalculationService scmCalculationService;

  @Override
  public Integer getMetric1FromSettings(final Settings settings) {
    LOGGER.debug("getMetric1FromSettings");
    return this.sonarDao.getMetricIdByKey(settings.getString("metric1"));
  }

  @Override
  public Integer getMetric2FromSettings(final Settings settings) {
    LOGGER.debug("getMetric2FromSettings");
    return this.sonarDao.getMetricIdByKey(settings.getString("metric2"));
  }

  @Override
  public List<de.rinderle.softvis3d.domain.Metric> getDefinedMetricsForSnapshot(final Integer snapshotId) {
    LOGGER.debug("getDefinedMetricsForSnapshot " + snapshotId);
    return this.sonarDao.getDistinctMetricsBySnapshotId(snapshotId);
  }

  @Override
  public MinMaxValue getMinMaxMetricValuesByRootSnapshotId(int rootSnapshotId, int metricId) {
    LOGGER.debug("getMinMaxMetricValuesByRootSnapshotId " + rootSnapshotId);
    return this.sonarDao.getMinMaxMetricValuesByRootSnapshotId(rootSnapshotId, metricId);
  }

  @Override
  public boolean hasDependencies(Integer snapshotId) {
    LOGGER.debug("hasDependencies" + snapshotId);

    final List<SonarDependency> result = getDependencies(snapshotId);

    return !result.isEmpty();
  }

  @Override
  public List<ModuleInfo> getDirectModuleChildrenIds(Integer snapshotId) {
    return this.sonarDao.getDirectModuleChildrenIds(snapshotId);
  }

  @Override
  public int getMaxScmInfo(int rootSnapshotId) {
    int maxAuthorsCount = 0;

    final List<MetricResultDTO<String>> scmCommitter = getScmAuthors(rootSnapshotId);
    for (MetricResultDTO<String> aScmCommitter : scmCommitter) {
      final int differentAuthors = scmCalculationService.getDifferentAuthors(aScmCommitter.getValue(), "");

      if (differentAuthors > maxAuthorsCount) {
        maxAuthorsCount = differentAuthors;
      }
    }

    LOGGER.info("max authors count " + maxAuthorsCount);

    return maxAuthorsCount;
  }

  @Override
  public List<SonarDependency> getDependencies(Integer snapshotId) {
    LOGGER.debug("getDependencies " + snapshotId);

    List<ModuleInfo> modules = getDirectModuleChildrenIds(snapshotId);

    List<SonarDependency> result = new ArrayList<SonarDependency>();
    if (modules == null || modules.isEmpty()) {
      result = this.dependencyDao.getDependencies(snapshotId);
    } else {
      for (ModuleInfo module : modules) {
        result.addAll(this.dependencyDao.getDependencies(module.getId()));
      }
    }

    return result;
  }

  @Override
  public List<SonarSnapshot> getFlatChildrenWithMetrics(final VisualizationRequest requestDTO) {
    final List<SonarSnapshot> result = new ArrayList<SonarSnapshot>();

    final StopWatch stopWatch = new StopWatch();
    stopWatch.start();

    // final Integer authorMetricId = this.sonarDao.getMetricIdByKey(SCM_DATE_NAME);
    // final Integer authorDateMetricId = this.sonarDao.getMetricIdByKey(SCM_DATE_NAME);
    final List<MetricResultDTO<Integer>> snapshots = sonarDao.getAllSnapshotIdsWithRescourceId(
      requestDTO.getRootSnapshotId());

    for (MetricResultDTO<Integer> snapshot : snapshots) {
      final Integer snapshotId = snapshot.getId();
      SonarSnapshotBuilder builder = new SonarSnapshotBuilder(snapshotId);
      builder.withPath(sonarDao.getResourcePath(snapshot.getValue()));
      builder.withFootprintMeasure(sonarDao.getMetricDouble(requestDTO.getFootprintMetricId(), snapshotId));
      builder.withHeightMeasure(sonarDao.getMetricDouble(requestDTO.getHeightMetricId(), snapshotId));

      // TODO: do something with this information here or delete.
      // final String authors = this.sonarDao.getMetricText(authorMetricId, snapshotId);
      // final String authorDateMetric = this.sonarDao.getMetricText(authorDateMetricId, snapshotId);

      // int differentAuthors = scmCalculationService.getDifferentAuthors(authors, authorDateMetric);

      SonarSnapshot snapshotResult = builder.build();

      result.add(snapshotResult);
    }

    stopWatch.stop();
    LOGGER.info("Time for getting snapshots " + stopWatch.getTime() + " ms");

    return result;
  }

  private List<MetricResultDTO<String>> getScmAuthors(int rootSnapshotId) {
    final Integer authorMetricId = this.sonarDao.getMetricIdByKey(SCM_AUTHOR_NAME);

    return this.sonarDao.getMetricTextForAllProjectElementsWithMetric(rootSnapshotId, authorMetricId);
  }

}
