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
import org.sonar.api.resources.Scopes;

import java.util.ArrayList;
import java.util.List;

public class SonarSnapshot implements SourceObject {

//  private static final Logger LOGGER = LoggerFactory
//      .getLogger(Layout.class);

  private SonarSnapshotJpa snapshot;
  
  private Integer metric1;
  private Integer metric2;
  
  private SonarDao sonarDao;

  public SonarSnapshot(SonarSnapshotJpa snapshot, Integer metric1, Integer metric2, SonarDao sonarDao) {
    this.snapshot = snapshot;

    this.metric1 = metric1;
    this.metric2 = metric2;
    
    this.sonarDao = sonarDao;
  }

  @Override
  public Integer getId() {
    return snapshot.getId();
  }

  @Override
  public String getName() {
    return snapshot.getName();
  }

  @Override
  public Integer getDepth() {
    return snapshot.getDepth();
  }

  @Override
  public List<SonarSnapshot> getChildrenNodes() {
    List<SonarSnapshotJpa> result = sonarDao.getChildrenByScope(this.getId(), metric1, metric2, Scopes.DIRECTORY);
    
    return wrapSnapshotList(result);
  }

  @Override
  public List<SonarSnapshot> getChildrenLeaves() {
    List<SonarSnapshotJpa> result = sonarDao.getChildrenByScope(this.getId(), metric1, metric2, Scopes.FILE);
    
    return wrapSnapshotList(result);
  }

  @Override
  public Double getMetricFootprint() {
    return snapshot.getMetric1();
  }

  @Override
  public Double getMetricHeight() {
    return snapshot.getMetric2();
  }
  
  private List<SonarSnapshot> wrapSnapshotList(List<SonarSnapshotJpa> snapshots) {
    List<SonarSnapshot> result = new ArrayList<SonarSnapshot>();

    for (SonarSnapshotJpa snapshot : snapshots) {
      result.add(new SonarSnapshot(snapshot, metric1, metric2, sonarDao));
    }
    return result;
  }

  @Override
  public List<Integer> getChildrenIds() {
    return sonarDao.getSnapshotChildrenIdsById(this.getId());
  }
  
}
