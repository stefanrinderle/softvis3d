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
import org.sonar.api.database.DatabaseSession;

import java.util.List;

public interface SonarDao {

	void setDatabaseSession(DatabaseSession session);

	Integer getMetricIdByName(String name);

	List<Integer> getDistinctMetricsBySnapshotId(Integer snapshotId);

	List<Object[]> getAllProjectElementsWithMetric(Integer rootSnapshotId,
			Integer metricId);

	MinMaxValue getMinMaxMetricValuesByRootSnapshotId(int rootSnapshotId,
			int metricId);
}
