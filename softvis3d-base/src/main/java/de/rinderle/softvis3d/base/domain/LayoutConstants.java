/*
 * softvis3d-base
 * Copyright (C) 2015 Stefan Rinderle
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
package de.rinderle.softvis3d.base.domain;

import de.rinderle.softvis3d.base.layout.helper.HexaColor;

public interface LayoutConstants {

  /**
   * Plugin key and name.
   */

  String PLUGIN_KEY = "SoftVis3D";

  String PLUGIN_NAME = "SoftVis3D Viewer";

  String PLUGIN_TEMPLATE_PATH = "/softVis3D_page.html.erb";

  /**
   * Sonar properties.
   */

  String DOT_BIN_KEY = "dotBinDirectory";

  String DOT_BIN_NAME = "Dot executable file path";

  String DOT_BIN_DESCRIPTION = "This plugin requires Graphviz in order to create the layout. "
    + "See http://www.graphviz.org/ for installation instructions.";

  String DOT_BIN_DEFAULT = "/usr/bin/dot";

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
  String SOFTVIZ_COLOR = "SOFTVIZ_COLOR";

}
