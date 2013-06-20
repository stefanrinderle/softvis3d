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
package de.rinderle.softviz3d.layout.sonar;

import de.rinderle.softviz3d.layout.Layout;
import de.rinderle.softviz3d.layout.model.SourceObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sonar.api.database.DatabaseSession;
import org.sonar.api.database.model.Snapshot;
import org.sonar.api.measures.Metric;
import org.sonar.api.resources.Scopes;

import javax.persistence.PersistenceException;
import javax.persistence.Query;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class SnapshotWrapper implements SourceObject {

  private static final Logger LOGGER = LoggerFactory
      .getLogger(Layout.class);

  private Snapshot snapshot;

  private Metric footprintMetric;
  private Metric heightMetric;

  private DatabaseSession session;

  public SnapshotWrapper(Snapshot snapshot, Metric footprintMetric, Metric heightMetric, DatabaseSession session) {
    this.snapshot = snapshot;

    this.heightMetric = heightMetric;
    this.footprintMetric = footprintMetric;

    this.session = session;
  }

  public Integer getIdentifier() {
    return snapshot.getId();
  }

  public String getName() {
    return snapshot.getResourceId() + "_name";
  }

  public Integer getDepth() {
    return snapshot.getDepth();
  }

  public List<SnapshotWrapper> getChildrenNodes() {
    return this.getChildrenByScope(Scopes.DIRECTORY);
  }

  public List<SnapshotWrapper> getChildrenLeaves() {
    return this.getChildrenByScope(Scopes.FILE);
  }

  public List<Integer> getChildrenIds() {
    List<Integer> childrenIds;

    try {
      session.start();
      Query query = session
          .createQuery("select s.id from Snapshot s where s.parentId = ?");
      query.setParameter(1, this.snapshot.getId());

      childrenIds = (List<Integer>) query.getResultList();
    } catch (PersistenceException e) {
      LOGGER.error(e.getMessage(), e);
      childrenIds = null;
    } finally {
      session.stop();
    }

    return childrenIds;
  }

  @Override
  public Double getMetricFootprint() {
    return getMetric(this.footprintMetric.getId());
  }

  @Override
  public Double getMetricHeight() {
    return getMetric(this.heightMetric.getId());
  }
  
  private List<SnapshotWrapper> getChildrenByScope(String scope) {
    List<Snapshot> snapshots;

    try {
      session.start();
      Query query = session
          .createQuery("select s from Snapshot s where s.parentId = ? and s.scope = ?");
      query.setParameter(1, this.snapshot.getId());
      query.setParameter(2, scope);

      snapshots = (List<Snapshot>) query.getResultList();
    } catch (PersistenceException e) {
      LOGGER.error(e.getMessage(), e);
      snapshots = null;
    } finally {
      session.stop();
    }

    return wrapSnapshotList(snapshots);
  }

  private List<SnapshotWrapper> wrapSnapshotList(List<Snapshot> snapshots) {
    List<SnapshotWrapper> result = new ArrayList<SnapshotWrapper>();

    for (Snapshot snapshot : snapshots) {
      result.add(new SnapshotWrapper(snapshot, footprintMetric, heightMetric, session));
    }
    return result;
  }

  private Double getMetric(Integer metricId) {
    BigDecimal value;

    try {
      session.start();
      Query query = session
          .createNativeQuery("SELECT m.value FROM snapshots s " +
            "INNER JOIN project_measures m ON s.id = m.snapshot_id " +
            "WHERE m.metric_id = ? AND s.id = ?");
      query.setParameter(1, metricId);
      query.setParameter(2, this.snapshot.getId());

      value = (BigDecimal) query.getSingleResult();
    } catch (PersistenceException e) {
      LOGGER.error(e.getMessage(), e);
      value = null;
    } finally {
      session.stop();
    }

    return value.doubleValue();
  }
  
}
