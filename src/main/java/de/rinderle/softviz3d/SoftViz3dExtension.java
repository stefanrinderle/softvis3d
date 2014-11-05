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

import att.grappa.Graph;
import com.google.inject.Guice;
import com.google.inject.Injector;
import de.rinderle.softviz3d.guice.SoftViz3dModule;
import de.rinderle.softviz3d.layout.calc.Layout;
import de.rinderle.softviz3d.layout.calc.LayoutViewType;
import de.rinderle.softviz3d.layout.dot.DotExcecutorException;
import de.rinderle.softviz3d.sonar.DependencyDao;
import de.rinderle.softviz3d.sonar.SonarDao;
import de.rinderle.softviz3d.sonar.SonarService;
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

  private Settings settings;

  private SonarService sonarService;

  private Injector softVizInjector;

  public SoftViz3dExtension(final DatabaseSession session, final Settings settings) {
    this.settings = settings;

    this.softVizInjector = Guice.createInjector(new SoftViz3dModule());

    final SonarDao sonarDao = this.softVizInjector.getInstance(SonarDao.class);
    sonarDao.setDatabaseSession(session);
    final DependencyDao dependencyDao = this.softVizInjector.getInstance(DependencyDao.class);
    dependencyDao.setDatabaseSession(session);

    this.sonarService = this.softVizInjector.getInstance(SonarService.class);
  }

  public List<Integer> getMetricsForSnapshot(final Integer snapshotId) {
    LOGGER.info("getMetricsForSnapshot " + snapshotId);

    return this.sonarService.getDefinedMetricsForSnapshot(snapshotId);
  }

  public Integer getMetric1FromSettings() {
    return this.sonarService.getMetric1FromSettings(this.settings);
  }

  public Integer getMetric2FromSettings() {
    return this.sonarService.getMetric2FromSettings(this.settings);
  }

  public Map<Integer, Graph> createLayoutBySnapshotId(final Integer snapshotId,
    final String metricString1, final String metricString2, final String viewType) throws DotExcecutorException {
    LOGGER.info("Startup SoftViz3d plugin with snapshot " + snapshotId);

    this.logStartOfCalc(metricString1, metricString2, snapshotId);

    final Integer footprintMetricId = Integer.valueOf(metricString1);
    final Integer heightMetricId = Integer.valueOf(metricString2);

    final Layout layout = this.softVizInjector.getInstance(Layout.class);

    final LayoutViewType type;
    if ("dependency".equals(viewType)) {
      type = LayoutViewType.DEPENDENCY;
    } else {
      type = LayoutViewType.CITY;
    }

    return layout.startLayout(this.settings, snapshotId, footprintMetricId, heightMetricId, type);
  }

  private void logStartOfCalc(final String metricId1, final String metricId2,
    final Integer snapshotId) {
    LOGGER.info("Start layout calculation for snapshot "
      + snapshotId + ", " + "metrics " + metricId1
      + " and " + metricId2);
  }

}
