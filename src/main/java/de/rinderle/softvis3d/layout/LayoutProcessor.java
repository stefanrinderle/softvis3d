/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.layout;

import de.rinderle.softvis3d.domain.SnapshotTreeResult;
import de.rinderle.softvis3d.domain.VisualizationRequest;
import de.rinderle.softvis3d.domain.graph.ResultPlatform;
import de.rinderle.softvis3d.layout.dot.DotExecutorException;
import org.sonar.api.config.Settings;

public interface LayoutProcessor {

	java.util.Map<Integer, ResultPlatform> process(Settings settings,
			VisualizationRequest requestDTO,
			SnapshotTreeResult snapshotTreeResult) throws DotExecutorException;
}
