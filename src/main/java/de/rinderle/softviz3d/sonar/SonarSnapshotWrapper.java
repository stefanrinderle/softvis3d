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

import de.rinderle.softviz3d.layout.interfaces.SourceObject;
import org.sonar.api.resources.Scopes;

import java.util.ArrayList;
import java.util.List;

public class SonarSnapshotWrapper implements SourceObject {

  private SonarSnapshot snapshot;

  private Integer footprintMetricId;
  private Integer heightMetricId;

  private SonarDao sonarDao;

  public SonarSnapshotWrapper(SonarSnapshot snapshot, Integer footprintMetricId, Integer heightMetricId, SonarDao sonarDao) {
    this.snapshot = snapshot;

    this.footprintMetricId = footprintMetricId;
    this.heightMetricId = heightMetricId;

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
  public Double getMetricFootprintValue() {
    return snapshot.getFootprintMetricValue();
  }

  @Override
  public Double getMetricHeightValue() {
    return snapshot.getHeightMetricValue();
  }
  
  @Override
  public List<SonarSnapshotWrapper> getChildrenNodes() {
    List<SonarSnapshot> result = sonarDao.getChildrenByScope(
        this.getId(), footprintMetricId, heightMetricId, Scopes.DIRECTORY);

    return wrapSnapshotList(result);
  }

  @Override
  public List<SonarSnapshotWrapper> getChildrenLeaves() {
    List<SonarSnapshot> result = sonarDao.getChildrenByScope(
        this.getId(), footprintMetricId, heightMetricId, Scopes.FILE);

    return wrapSnapshotList(result);
  }
  
  @Deprecated
  @Override
  public List<Integer> getChildrenIds() {
    return sonarDao.getSnapshotChildrenIdsById(this.getId());
  }

  private List<SonarSnapshotWrapper> wrapSnapshotList(List<SonarSnapshot> snapshots) {
    List<SonarSnapshotWrapper> result = new ArrayList<SonarSnapshotWrapper>();

    for (SonarSnapshot snapshotElement : snapshots) {
      result.add(new SonarSnapshotWrapper(snapshotElement, footprintMetricId, heightMetricId, sonarDao));
    }
    return result;
  }


}
