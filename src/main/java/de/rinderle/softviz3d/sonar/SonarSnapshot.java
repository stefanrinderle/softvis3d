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

public class SonarSnapshot implements SourceObject {

  // private static final Logger LOGGER = LoggerFactory
  // .getLogger(SonarSnapshot.class);

  private SonarSnapshotJpa snapshot;

  private Integer footprintMetricId;
  private Integer heightMetricId;

  private SonarDao sonarDao;

  public SonarSnapshot(SonarSnapshotJpa snapshot, Integer footprintMetricId, Integer heightMetricId, SonarDao sonarDao) {
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
  public List<SonarSnapshot> getChildrenNodes() {
    List<SonarSnapshotJpa> result = sonarDao.getChildrenByScope(this.getId(), footprintMetricId, heightMetricId, Scopes.DIRECTORY);

    return wrapSnapshotList(result);
  }

  @Override
  public List<SonarSnapshot> getChildrenLeaves() {
    List<SonarSnapshotJpa> result = sonarDao.getChildrenByScope(this.getId(), footprintMetricId, heightMetricId, Scopes.FILE);

    return wrapSnapshotList(result);
  }

  @Override
  public Double getMetricFootprint() {
    return snapshot.getFootprintMetricValue();
  }

  @Override
  public Double getMetricHeight() {
    return snapshot.getHeightMetricValue();
  }

  private List<SonarSnapshot> wrapSnapshotList(List<SonarSnapshotJpa> snapshots) {
    List<SonarSnapshot> result = new ArrayList<SonarSnapshot>();

    for (SonarSnapshotJpa snapshotElement : snapshots) {
      result.add(new SonarSnapshot(snapshotElement, footprintMetricId, heightMetricId, sonarDao));
    }
    return result;
  }

  @Override
  public List<Integer> getChildrenIds() {
    return sonarDao.getSnapshotChildrenIdsById(this.getId());
  }

}
