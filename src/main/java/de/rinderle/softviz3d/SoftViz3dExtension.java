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
package de.rinderle.softviz3d;

import com.google.inject.Guice;
import com.google.inject.Injector;
import de.rinderle.softviz3d.dao.DaoService;
import de.rinderle.softviz3d.dao.DependencyDao;
import de.rinderle.softviz3d.dao.SonarDao;
import de.rinderle.softviz3d.domain.LayoutViewType;
import de.rinderle.softviz3d.domain.VisualizationRequest;
import de.rinderle.softviz3d.domain.graph.ResultPlatform;
import de.rinderle.softviz3d.guice.SoftViz3dModule;
import de.rinderle.softviz3d.layout.dot.DotExecutorException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sonar.api.ServerExtension;
import org.sonar.api.config.Settings;
import org.sonar.api.database.DatabaseSession;

import java.util.List;
import java.util.Map;

public class SoftViz3dExtension implements ServerExtension {

  private static final Logger LOGGER = LoggerFactory
    .getLogger(SoftViz3dExtension.class);

  private final Settings settings;
  private final DaoService daoService;
  private final Injector softVizInjector;

  public SoftViz3dExtension(final DatabaseSession session, final Settings settings) {
    LOGGER.warn("Constructor SoftViz3dExtension");
    this.settings = settings;

    this.softVizInjector = Guice.createInjector(new SoftViz3dModule());

    final SonarDao sonarDao = this.softVizInjector.getInstance(SonarDao.class);
    sonarDao.setDatabaseSession(session);
    final DependencyDao dependencyDao = this.softVizInjector.getInstance(DependencyDao.class);
    dependencyDao.setDatabaseSession(session);

    this.daoService = this.softVizInjector.getInstance(DaoService.class);
  }

  public List<Integer> getMetricsForSnapshot(final Integer snapshotId) {
    LOGGER.info("getMetricsForSnapshot " + snapshotId);

    return this.daoService.getDefinedMetricsForSnapshot(snapshotId);
  }

  public Integer getMetric1FromSettings() {
    return this.daoService.getMetric1FromSettings(this.settings);
  }

  public Integer getMetric2FromSettings() {
    return this.daoService.getMetric2FromSettings(this.settings);
  }

  public Map<Integer, ResultPlatform> createLayoutBySnapshotId(final Integer snapshotId,
    final String metricString1, final String metricString2, final String viewType) throws DotExecutorException {
    LOGGER.info("Startup SoftViz3d plugin with snapshot " + snapshotId);

    this.logStartOfCalc(metricString1, metricString2, snapshotId);

    final LayoutViewType type = LayoutViewType.valueOfRequest(viewType);

    final Integer footprintMetricId = Integer.valueOf(metricString1);
    final Integer heightMetricId = Integer.valueOf(metricString2);

    final VisualizationRequest requestDTO = new VisualizationRequest(snapshotId, type, footprintMetricId,
      heightMetricId);

    final VisualizationProcessor visualizationProcessor = this.softVizInjector
      .getInstance(VisualizationProcessor.class);
    return visualizationProcessor.visualize(this.settings, requestDTO);
  }

  private void logStartOfCalc(final String metricId1, final String metricId2,
    final Integer snapshotId) {
    LOGGER.info("Start layout calculation for snapshot "
      + snapshotId + ", " + "metrics " + metricId1
      + " and " + metricId2);
  }

}
