/*
 * SoftViz3d Sonar plugin
 * Copyright (C) 2013 Stefan Rinderle
 * stefan@rinderle.info
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02
 */
package de.rinderle.softviz3d.domain;

public interface SoftViz3dConstants {

  /**
   * Plugin key and name.
   */

  String PLUGIN_KEY = "Softviz3d";

  String PLUGIN_NAME = "Softviz3d Viewer";

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

  String GRAPH_ATTR_COLOR = "color";
  String GRAPH_ATTR_NODES_COLOR = "nodesColor";
  String GRAPH_ATTR_OPACITY = "opacity";
  String GRAPH_ATTR_BUILDING_HEIGHT = "buildingHeight";

  /**
   * String name for y axis in 3d.
   *
   *   I(y)
   *   I
   *   I
   *   ---------- (x)
   *  /
   * / (z)
   */
  String LAYER_HEIGHT_3D = "layerHeight3d";

  double DPI_DOT_SCALE = 72.0;

}
