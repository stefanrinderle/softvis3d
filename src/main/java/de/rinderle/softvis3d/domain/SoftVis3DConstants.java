/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.domain;

import de.rinderle.softvis3d.layout.helper.HexaColor;

public interface SoftVis3DConstants {

	/**
	 * Plugin key and name.
	 */

	String PLUGIN_KEY = "SoftVis3D";

	String PLUGIN_NAME = "SoftVis3D Viewer";

	/**
	 * Sonar properties.
	 */

	String DOT_BIN_KEY = "dotBinDirectory";

	String DOT_BIN_NAME = "Dot executable file path";

	String DOT_BIN_DESCRIPTION = "This plugin requires Graphviz in order to create the layout. "
			+ "See http://www.graphviz.org/ for installation instructions.";

	String DOT_BIN_DEFAULT = "/usr/local/bin/dot";

	/**
	 * Visualization
	 */

	int MIN_SIDE_LENGTH = 5;
	int MIN_BUILDING_HEIGHT = 10;

	/**
	 * Layout constants.
	 */

	String GRAPH_ATTR_BUILDING_HEIGHT = "buildingHeight";
	String GRAPH_ATTR_PENWIDTH = "penwidth";

	double DPI_DOT_SCALE = 72.0;

	int LAYER_HEIGHT = 250;
	int PLATFORM_DEFAULT_HEIGHT = 3;
	int BUILDING_HEIGHT_MULTIPLIER = 2;

	HexaColor BUILDING_COLOR = new HexaColor(254, 140, 0);

	String GRAPH_ATTR_EDGE_RADIUS = "edgeRadius";
}
