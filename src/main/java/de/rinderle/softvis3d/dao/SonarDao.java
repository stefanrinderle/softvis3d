/*
 * SoftVis3D Sonar plugin
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
package de.rinderle.softvis3d.dao;

import de.rinderle.softvis3d.domain.MinMaxValue;
import org.sonar.api.database.DatabaseSession;

import java.util.List;

public interface SonarDao {

  void setDatabaseSession(DatabaseSession session);

  Integer getMetricIdByName(String name);

  List<Integer> getDistinctMetricsBySnapshotId(Integer snapshotId);

  List<Object[]> getAllProjectElementsWithMetric(Integer rootSnapshotId, Integer metricId);

  MinMaxValue getMinMaxMetricValuesByRootSnapshotId(int rootSnapshotId, int metricId);
}
