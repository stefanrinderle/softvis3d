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
import de.rinderle.softviz3d.layout.Layout;
import de.rinderle.softviz3d.layout.calc.LayoutVisitor;
import de.rinderle.softviz3d.layout.dot.DotExcecutorException;
import de.rinderle.softviz3d.sonar.SonarDao;
import de.rinderle.softviz3d.sonar.SonarMetric;
import de.rinderle.softviz3d.sonar.SonarSnapshot;
import de.rinderle.softviz3d.sonar.SonarSnapshotJpa;
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

  private DatabaseSession session;
  private Settings settings;
  
  public SoftViz3dExtension(DatabaseSession session, Settings settings) {
    this.session = session;
    this.settings = settings;
  }

  public List<Integer> getMetricsForSnapshot(Integer snapshotId) {
    SonarDao sonarDao = new SonarDao(session);
    
    LOGGER.info("getMetricsForSnapshot " + snapshotId);
    
    LOGGER.info(settings.getString("metric1"));

    return sonarDao.getDefinedMetricsForSnapshot(snapshotId);
  }
  
  public Map<Integer, Graph> createLayoutBySnapshotId(Integer snapshotId) throws DotExcecutorException {
    SonarDao sonarDao = new SonarDao(session);
    
    Integer metricId1 = sonarDao.getMetricIdByName(settings.getString("metric1"));
    if (metricId1 == null) {
      metricId1 = 1;
    }
     
    Integer metricId2 = sonarDao.getMetricIdByName(settings.getString("metric2"));
    if (metricId2 == null) {
      metricId2 = 20;
    }
     
    return createLayoutBySnapshotId(snapshotId, metricId1, metricId2);
  }
  
  private Map<Integer, Graph> createLayoutBySnapshotId(Integer snapshotId, Integer metricId1, Integer metricId2) throws DotExcecutorException {
    LOGGER.info("Startup SoftViz3d plugin");

    SonarDao sonarDao = new SonarDao(session);

    List<Double> minMaxValues = sonarDao.getMinMaxMetricValuesByRootSnapshotId(snapshotId, metricId1, metricId2);

    SonarMetric footprintMetricWrapper = new SonarMetric(minMaxValues.get(0), minMaxValues.get(1));

    SonarMetric heightMetricWrapper = new SonarMetric(minMaxValues.get(2), minMaxValues.get(3));

    SonarSnapshotJpa snapshot = sonarDao.getSnapshotById(snapshotId, metricId1, metricId2);
    SonarSnapshot snapshotWrapper = new SonarSnapshot(snapshot, metricId1, metricId2, sonarDao);

    LOGGER.info("Start layout calculation for snapshot " + snapshotWrapper.getName() + ", " +
      "metrics " + metricId1 + " and " + metricId2);

    LOGGER.info("Metric " + metricId1 + " - min : " + minMaxValues.get(0) + " max: " + minMaxValues.get(1));
    LOGGER.info("Metric " + metricId2 + " - min : " + minMaxValues.get(2) + " max: " + minMaxValues.get(3));

    Layout layout = new Layout(new LayoutVisitor(settings, footprintMetricWrapper, heightMetricWrapper));
    Map<Integer, Graph> result = layout.startLayout(snapshotWrapper);

    return result;
  }

}
