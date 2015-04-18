/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.dao;

import de.rinderle.softvis3d.domain.MinMaxValue;
import de.rinderle.softvis3d.domain.sonar.ModuleInfo;
import org.sonar.api.database.DatabaseSession;

import java.math.BigInteger;
import java.util.List;

public interface SonarDao {

    void setDatabaseSession(DatabaseSession session);

    List<ModuleInfo> getDirectModuleChildrenIds(Integer snapshotId);

    Integer getMetricIdByKey(String name);

    List<de.rinderle.softvis3d.domain.Metric> getDistinctMetricsBySnapshotId(Integer snapshotId);

    BigInteger getScmInfoMetricId(String name);

    List<de.rinderle.softvis3d.dao.dto.MetricResultDTO<String>> getAllProjectElementsWithPath(Integer rootSnapshotId);

    List<de.rinderle.softvis3d.dao.dto.MetricResultDTO<Double>> getAllProjectElementsWithMetric(
            Integer rootSnapshotId, Integer metricId);

    MinMaxValue getMinMaxMetricValuesByRootSnapshotId(int rootSnapshotId, int metricId);

    List<de.rinderle.softvis3d.dao.dto.MetricResultDTO<String>> getMetricTextForAllProjectElementsWithMetric(
            Integer rootSnapshotId, Integer metricId);
}
