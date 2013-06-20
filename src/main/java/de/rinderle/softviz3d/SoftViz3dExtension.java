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

import att.grappa.Graph;
import de.rinderle.softviz3d.dot.DotExcecutorException;
import de.rinderle.softviz3d.layout.Layout;
import de.rinderle.softviz3d.layout.LayoutVisitor;
import de.rinderle.softviz3d.layout.interfaces.SnapshotWrapper;
import de.rinderle.softviz3d.layout.model.SourceMetric;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sonar.api.ServerExtension;
import org.sonar.api.database.DatabaseSession;
import org.sonar.api.database.model.Snapshot;

import javax.persistence.PersistenceException;
import javax.persistence.Query;

import java.util.Map;

public class SoftViz3dExtension implements ServerExtension {

  private static final Logger LOGGER = LoggerFactory
      .getLogger(SoftViz3dExtension.class);

  public static final String SOFTVIZ3D_METRIC1_NAME = "metric1";
  public static final String SOFTVIZ3D_METRIC2_NAME = "metric2";

  // private MeasureDao measureDao;
  private DatabaseSession session;

  public SoftViz3dExtension(DatabaseSession session) {
    // this.measureDao = new MeasureDao(session);
    this.session = session;
  }

  public Map<Integer, Graph> createLayoutBySnapshotId(Integer snapshotId,
      Integer metricId1, Integer metricId2) throws DotExcecutorException {

    Layout layout = new Layout(new LayoutVisitor(new SourceMetric() {
      
      @Override
      public Double getWorstValue() {
        // TODO Auto-generated method stub
        return null;
      }
      
      @Override
      public Integer getIdentifier() {
        // TODO Auto-generated method stub
        return null;
      }
      
      @Override
      public Double getBestValue() {
        // TODO Auto-generated method stub
        return null;
      }
    }));

    Snapshot snapshot = getSnapshotById(snapshotId);

    SnapshotWrapper wrapper = new SnapshotWrapper(snapshot, session);

    Map<Integer, Graph> result = layout.startLayout(wrapper);

    return result;
  }

  private Snapshot getSnapshotById(Integer id) {
    Snapshot snapshot;

    try {
      session.start();
      Query query = session
          .createQuery("select s from Snapshot s where s.id = ?");
      query.setParameter(1, id);

      snapshot = (Snapshot) query.getSingleResult();
    } catch (PersistenceException e) {
      LOGGER.error(e.getMessage(), e);
      snapshot = null;
    } finally {
      session.stop();
    }

    return snapshot;
  }

}
