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
import org.sonar.api.database.model.Snapshot;

import java.util.List;

public interface SonarDao {

	void setDatabaseSession(DatabaseSession session);

  List<ModuleInfo> getDirectModuleChildrenIds(Integer snapshotId);

  Integer getMetricIdByName(String name);

	List<de.rinderle.softvis3d.domain.Metric> getDistinctMetricsBySnapshotId(Integer snapshotId);

	List<Object[]> getAllProjectElementsWithMetric(Integer rootSnapshotId, Integer metricId);

	MinMaxValue getMinMaxMetricValuesByRootSnapshotId(int rootSnapshotId,
			int metricId);
}
