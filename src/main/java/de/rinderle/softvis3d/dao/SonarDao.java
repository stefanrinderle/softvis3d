/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.dao;

import java.util.List;

import org.sonar.api.database.DatabaseSession;
import de.rinderle.softvis3d.dao.dto.MetricResultDTO;
import de.rinderle.softvis3d.domain.MinMaxValue;
import de.rinderle.softvis3d.domain.sonar.ModuleInfo;

public interface SonarDao {

    void setDatabaseSession(DatabaseSession session);

    List<ModuleInfo> getDirectModuleChildrenIds(Integer snapshotId);

    Integer getMetricIdByKey(String name);

    List<de.rinderle.softvis3d.domain.Metric> getDistinctMetricsBySnapshotId(Integer snapshotId);

    Double getMetricDouble(int metricId, Integer snapshotId);

    String getMetricText(int metricId, Integer snapshotId);

    List<MetricResultDTO<Integer>> getAllSnapshotIdsWithRescourceId(Integer rootSnapshotId);

    MinMaxValue getMinMaxMetricValuesByRootSnapshotId(int rootSnapshotId, int metricId);

    List<de.rinderle.softvis3d.dao.dto.MetricResultDTO<String>> getMetricTextForAllProjectElementsWithMetric(
            Integer rootSnapshotId, Integer metricId);

    String getResourcePath(Integer resourceId);

}
