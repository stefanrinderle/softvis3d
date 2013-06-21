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
package de.rinderle.softviz3d.sonar;

import de.rinderle.softviz3d.layout.interfaces.SourceObject;

import org.sonar.api.database.model.Snapshot;
import org.sonar.api.measures.Metric;
import org.sonar.api.resources.Scopes;

import java.util.ArrayList;
import java.util.List;

public class SonarSnapshot implements SourceObject {

//  private static final Logger LOGGER = LoggerFactory
//      .getLogger(Layout.class);

  private Snapshot snapshot;

  private Metric footprintMetric;
  private Metric heightMetric;

  private SonarDao sonarDao;

  public SonarSnapshot(Snapshot snapshot, Metric footprintMetric, Metric heightMetric, SonarDao sonarDao) {
    this.snapshot = snapshot;

    this.heightMetric = heightMetric;
    this.footprintMetric = footprintMetric;

    this.sonarDao = sonarDao;
  }

  @Override
  public Integer getId() {
    return snapshot.getId();
  }

  @Override
  public String getName() {
    return snapshot.getResourceId() + "_name";
  }

  @Override
  public Integer getDepth() {
    return snapshot.getDepth();
  }

  @Override
  public List<SonarSnapshot> getChildrenNodes() {
    List<Snapshot> result = sonarDao.getChildrenByScope(this.getId(), Scopes.DIRECTORY);
    
    return wrapSnapshotList(result);
  }

  @Override
  public List<SonarSnapshot> getChildrenLeaves() {
    List<Snapshot> result = sonarDao.getChildrenByScope(this.getId(), Scopes.FILE);
    
    return wrapSnapshotList(result);
  }

  @Override
  public Double getMetricFootprint() {
    return sonarDao.getMetricValue(this.getId(), this.footprintMetric.getId());
  }

  @Override
  public Double getMetricHeight() {
    return sonarDao.getMetricValue(this.getId(), this.heightMetric.getId());
  }
  
  private List<SonarSnapshot> wrapSnapshotList(List<Snapshot> snapshots) {
    List<SonarSnapshot> result = new ArrayList<SonarSnapshot>();

    for (Snapshot snapshot : snapshots) {
      result.add(new SonarSnapshot(snapshot, footprintMetric, heightMetric, sonarDao));
    }
    return result;
  }

  @Override
  public List<Integer> getChildrenIds() {
    return sonarDao.getSnapshotChildrenIdsById(this.getId());
  }
  
}
