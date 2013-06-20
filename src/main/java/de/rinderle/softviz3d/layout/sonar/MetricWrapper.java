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
import de.rinderle.softviz3d.layout.model.SourceMetric;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sonar.api.database.DatabaseSession;
import org.sonar.api.database.model.MeasureModel;
import org.sonar.api.measures.Metric;

import javax.persistence.PersistenceException;
import javax.persistence.Query;

import java.math.BigDecimal;

public class MetricWrapper implements SourceMetric {

  private static final Logger LOGGER = LoggerFactory
      .getLogger(Layout.class);

  private Metric metric;
  private DatabaseSession session;
  private Integer rootSnapshotId;
  
  public MetricWrapper(Metric metric, Integer rootSnapshotId, DatabaseSession session) {
    this.metric = metric;
    this.session = session;
    this.rootSnapshotId = rootSnapshotId;
  }

  @Override
  public Integer getIdentifier() {
    return metric.getId();
  }

  @Override
  public Double getBestValue() {
    return metric.getBestValue();
  }

  @Override
  public Double getWorstValue() {
    return metric.getWorstValue();
  }

//  private void getMaxMinValues() {
//    BigDecimal value;
//
//    try {
//      session.start();
//      Query query = session
//          .createNativeQuery("SELECT m.value FROM snapshots s " +
//            "INNER JOIN project_measures m ON s.id = m.snapshot_id " +
//            "WHERE m.metric_id = 20 AND s.id = ?");
//      query.setParameter(1, this.metric.getId());
//
//      value = (BigDecimal) query.getSingleResult();
//    } catch (PersistenceException e) {
//      LOGGER.error(e.getMessage(), e);
//      value = null;
//    } finally {
//      session.stop();
//    }
//
//  }

}
