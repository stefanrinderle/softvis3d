/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.dao;

import de.rinderle.softvis3d.domain.sonar.SonarDependency;
import org.sonar.api.database.DatabaseSession;

import java.util.List;

public interface DependencyDao {
	void setDatabaseSession(DatabaseSession session);

	List<SonarDependency> getDependencies(Integer projectSnapshotId);
}
