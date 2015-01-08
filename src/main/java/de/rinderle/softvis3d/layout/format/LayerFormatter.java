/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.layout.format;

import de.rinderle.softvis3d.domain.LayoutViewType;
import de.rinderle.softvis3d.domain.MinMaxValue;
import de.rinderle.softvis3d.domain.graph.ResultPlatform;

public interface LayerFormatter {
	void format(ResultPlatform graph, Integer depth, LayoutViewType viewType);

	double calcBuildingHeight(Double value, MinMaxValue minMaxMetricHeight);

	double calcSideLength(Double value, MinMaxValue minMaxMetricFootprint);

	double calcEdgeRadius(int counter);
}
