/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.domain;

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

  String DOT_BIN_DESCRIPTION = "This plugin requires Graphviz in order to create the layout. " +
    "See http://www.graphviz.org/ for installation instructions.";

  String DOT_BIN_DEFAULT = "/usr/local/bin/dot";

  /**
   * Visualization
   */

  double MIN_SIDE_LENGTH_PERCENT = 5;

  /**
   * Layout constants.
   */

  String GRAPH_ATTR_BUILDING_HEIGHT = "buildingHeight";

  double DPI_DOT_SCALE = 72.0;

}
