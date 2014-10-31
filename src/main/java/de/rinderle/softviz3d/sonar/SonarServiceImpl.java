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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sonar.api.config.Settings;

import java.util.List;

public class SonarServiceImpl implements SonarService {

  private static final Logger LOGGER = LoggerFactory
    .getLogger(SonarServiceImpl.class);

  @Inject
  private SonarDao sonarDao;

  @Override
  public Integer getMetric1FromSettings(final Settings settings) {
    return sonarDao.getMetricIdByName(settings.getString("metric1"));
  }

  @Override
  public Integer getMetric2FromSettings(final Settings settings) {
    return sonarDao.getMetricIdByName(settings.getString("metric2"));
  }

  @Override
  public List<Integer> getDefinedMetricsForSnapshot(final Integer snapshotId) {
    return sonarDao.getDistinctMetricsBySnapshotId(snapshotId);
  }

  @Override
  public List<Double> getMinMaxMetricValuesByRootSnapshotId(
    final Integer rootSnapshotId, final Integer footprintMetricId,
    final Integer heightMetricId) {
    return sonarDao.getMinMaxMetricValuesByRootSnapshotId(rootSnapshotId,
      footprintMetricId, heightMetricId);
  }

}
