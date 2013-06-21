/*
 * SoftViz3d Sonar plugin
 * Copyright (C) 2013 Stefan Rinderle
 * dev@sonar.codehaus.org
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

import de.rinderle.softviz3d.layout.dot.DotExcecutorException;

import de.rinderle.softviz3d.layout.calc.LayoutVisitor;

import de.rinderle.softviz3d.sonar.SonarMetric;
import de.rinderle.softviz3d.sonar.SonarSnapshot;
import de.rinderle.softviz3d.sonar.SonarDao;

import att.grappa.Graph;
import de.rinderle.softviz3d.layout.Layout;
import org.sonar.api.ServerExtension;
import org.sonar.api.database.DatabaseSession;
import org.sonar.api.database.model.Snapshot;
import org.sonar.api.measures.Metric;

import java.util.Map;

public class SoftViz3dExtension implements ServerExtension {

//  private static final Logger LOGGER = LoggerFactory
//      .getLogger(SoftViz3dExtension.class);

  public static final String SOFTVIZ3D_METRIC1_NAME = "metric1";
  public static final String SOFTVIZ3D_METRIC2_NAME = "metric2";

  private SonarDao sonarDao;

  public SoftViz3dExtension(DatabaseSession session) {
    this.sonarDao = new SonarDao(session);
  }

  public Map<Integer, Graph> createLayoutBySnapshotId(Integer snapshotId,
      Integer metricId1, Integer metricId2) throws DotExcecutorException {

    Metric footprintMetric = sonarDao.getMetricById(metricId1);
    SonarMetric footprintMetricWrapper  = new SonarMetric(footprintMetric, snapshotId, sonarDao);

    Metric heightMetric = sonarDao.getMetricById(metricId2);
    SonarMetric heightMetricWrapper= new SonarMetric(footprintMetric, snapshotId, sonarDao);
    
    Snapshot snapshot = sonarDao.getSnapshotById(snapshotId);
    SonarSnapshot snapshotWrapper = new SonarSnapshot(snapshot, footprintMetric, heightMetric, sonarDao);

    Layout layout = new Layout(new LayoutVisitor(footprintMetricWrapper));
    Map<Integer, Graph> result = layout.startLayout(snapshotWrapper);

    return result;
  }

}
