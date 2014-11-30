/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.dao;

import de.rinderle.softvis3d.domain.MinMaxValue;
import de.rinderle.softvis3d.domain.VisualizationRequest;
import de.rinderle.softvis3d.domain.sonar.SonarDependency;
import de.rinderle.softvis3d.domain.sonar.SonarSnapshot;
import org.sonar.api.config.Settings;

import java.util.List;

public interface DaoService {

  Integer getMetric1FromSettings(Settings settings);

  Integer getMetric2FromSettings(Settings settings);

  /**
   * Request all metrics which are set on the file level (Scope) for
   * the requested root snapshot.
   * 
   * @param snapshotId Root snapshot ID
   * @return defined metrics on the file level scope
   */
  List<Integer> getDefinedMetricsForSnapshot(
    Integer snapshotId);

  MinMaxValue getMinMaxMetricValuesByRootSnapshotId(int rootSnapshotId, int metricId);

  List<SonarDependency> getDependencies(Integer snapshotId);

  List<SonarSnapshot> getFlatChildrenWithMetrics(VisualizationRequest requestDTO);

}
