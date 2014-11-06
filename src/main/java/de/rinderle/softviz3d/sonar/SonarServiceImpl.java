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

import com.google.inject.Inject;
import de.rinderle.softviz3d.dto.MinMaxValueDTO;
import de.rinderle.softviz3d.dto.SonarDependencyDTO;
import de.rinderle.softviz3d.dto.SonarSnapshotDTO;
import de.rinderle.softviz3d.layout.calc.VisualizationRequestDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sonar.api.config.Settings;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class SonarServiceImpl implements SonarService {

  private static final Logger LOGGER = LoggerFactory
    .getLogger(SonarServiceImpl.class);

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
  public MinMaxValueDTO getMinMaxMetricValuesByRootSnapshotId(int rootSnapshotId, int metricId) {
    LOGGER.debug("getMinMaxMetricValuesByRootSnapshotId " + rootSnapshotId);
    return this.sonarDao.getMinMaxMetricValuesByRootSnapshotId(rootSnapshotId, metricId);

  }

  @Override
  public List<SonarDependencyDTO> getDependencies(Integer snapshotId) {
    LOGGER.debug("getDependencies " + snapshotId);
    return this.dependencyDao.getDependencies(snapshotId);
  }

  @Override
  public List<SonarSnapshotDTO> getFlatChildrenWithMetrics(final VisualizationRequestDTO requestDTO) {
    final List<SonarSnapshotDTO> result = new ArrayList<SonarSnapshotDTO>();

    final List<Object[]> resultFootprintMetric =
      this.sonarDao.getAllProjectElementsWithMetric(
        requestDTO.getRootSnapshotId(), requestDTO.getFootprintMetricId());
    final List<Object[]> resultHeightMetric =
      this.sonarDao.getAllProjectElementsWithMetric(
        requestDTO.getRootSnapshotId(), requestDTO.getHeightMetricId());

    // join result lists
    for (int i = 0; i < resultFootprintMetric.size(); i = i + 1) {
      final int id = (Integer) resultFootprintMetric.get(i)[0];
      final String path = (String) resultFootprintMetric.get(i)[1];
      BigDecimal footprintMetricValue = (BigDecimal) resultFootprintMetric.get(i)[2];
      BigDecimal heightMetricValue = (BigDecimal) resultHeightMetric.get(i)[2];

      if (footprintMetricValue == null) {
        footprintMetricValue = BigDecimal.ZERO;
      }

      // check for null values
      if (heightMetricValue == null) {
        heightMetricValue = BigDecimal.ZERO;
      }

      final SonarSnapshotDTO element = new SonarSnapshotDTO(id, path, footprintMetricValue.doubleValue(),
        heightMetricValue.doubleValue());

      result.add(element);
    }

    return result;

  }

}
