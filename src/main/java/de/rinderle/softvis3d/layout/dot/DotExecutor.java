/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.layout.dot;

import att.grappa.Graph;
import de.rinderle.softvis3d.domain.LayoutViewType;
import org.sonar.api.config.Settings;

public interface DotExecutor {

	public abstract Graph run(Graph inputGraph, Settings settings,
			LayoutViewType viewType) throws DotExecutorException;

}
