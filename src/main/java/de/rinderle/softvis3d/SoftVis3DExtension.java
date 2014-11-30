/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d;

import com.google.inject.Guice;
import com.google.inject.Injector;
import de.rinderle.softvis3d.dao.DaoService;
import de.rinderle.softvis3d.dao.DependencyDao;
import de.rinderle.softvis3d.dao.SonarDao;
import de.rinderle.softvis3d.domain.LayoutViewType;
import de.rinderle.softvis3d.domain.VisualizationRequest;
import de.rinderle.softvis3d.domain.graph.ResultPlatform;
import de.rinderle.softvis3d.guice.SoftVis3DModule;
import de.rinderle.softvis3d.layout.dot.DotExecutorException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sonar.api.ServerExtension;
import org.sonar.api.config.Settings;
import org.sonar.api.database.DatabaseSession;

import java.util.List;
import java.util.Map;

public class SoftVis3DExtension implements ServerExtension {

  private static final Logger LOGGER = LoggerFactory
    .getLogger(SoftVis3DExtension.class);

  private final Settings settings;
  private final DaoService daoService;
  private final Injector softVis3DInjector;

  public SoftVis3DExtension(final DatabaseSession session, final Settings settings) {
    LOGGER.warn("Constructor SoftVis3DExtension");
    this.settings = settings;

    this.softVis3DInjector = Guice.createInjector(new SoftVis3DModule());

    final SonarDao sonarDao = this.softVis3DInjector.getInstance(SonarDao.class);
    sonarDao.setDatabaseSession(session);
    final DependencyDao dependencyDao = this.softVis3DInjector.getInstance(DependencyDao.class);
    dependencyDao.setDatabaseSession(session);

    this.daoService = this.softVis3DInjector.getInstance(DaoService.class);
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
    LOGGER.info("Startup SoftVis3D plugin with snapshot " + snapshotId);

    this.logStartOfCalc(metricString1, metricString2, snapshotId);

    final LayoutViewType type = LayoutViewType.valueOfRequest(viewType);

    final Integer footprintMetricId = Integer.valueOf(metricString1);
    final Integer heightMetricId = Integer.valueOf(metricString2);

    final VisualizationRequest requestDTO = new VisualizationRequest(snapshotId, type, footprintMetricId,
      heightMetricId);

    final VisualizationProcessor visualizationProcessor = this.softVis3DInjector
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
