/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
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
import de.rinderle.softvis3d.domain.VisualizationRequest;
import de.rinderle.softvis3d.domain.sonar.ModuleInfo;
import de.rinderle.softvis3d.domain.sonar.SonarDependency;
import de.rinderle.softvis3d.domain.sonar.SonarSnapshot;
import org.sonar.api.config.Settings;

import java.util.List;

public interface DaoService {

  Integer getMetric1FromSettings(Settings settings);

  Integer getMetric2FromSettings(Settings settings);

  /**
   * Request all metrics which are set on the file level (Scope) for the requested root snapshot.
   * 
   * @param snapshotId
   *            Root snapshot ID
   * @return defined metrics on the file level scope
   */
  List<de.rinderle.softvis3d.domain.Metric> getDefinedMetricsForSnapshot(Integer snapshotId);

  MinMaxValue getMinMaxMetricValuesByRootSnapshotId(int rootSnapshotId, int metricId);

  List<SonarDependency> getDependencies(Integer snapshotId);

  List<SonarSnapshot> getFlatChildrenWithMetrics(VisualizationRequest requestDTO);

  boolean hasDependencies(Integer snapshotId);

  List<ModuleInfo> getDirectModuleChildrenIds(Integer snapshotId);

  int getMaxScmInfo(int rootSnapshotId);
}
