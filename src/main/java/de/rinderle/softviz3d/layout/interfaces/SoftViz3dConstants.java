package de.rinderle.softviz3d.layout.interfaces;

public interface SoftViz3dConstants {
  
  /**
   * Plugin key and name.
   */
  
  public static final String PLUGIN_KEY = "Softviz3d";

  public static final String PLUGIN_NAME = "Softviz3d Viewer";

  /**
   * Sonar properties.
   */
  
  public static final String DOT_BIN_KEY = "dotBinDirectory";
  
  public static final String DOT_BIN_NAME = "Dot executable file path";

  public static final String DOT_BIN_DESCRIPTION = "This plugin requires Graphviz in order to create the layout. " +
  		"See http://www.graphviz.org/ for installation instructions.";

  public static final String DOT_BIN_DEFAULT = "/usr/local/bin/dot";
  
  /**
   * Visualization
   */
  
  public static final double MIN_SIDE_LENGTH = 0.5;
  
  public static final double MAX_SIDE_LENGTH = 10;
  
  /**
   * Layout constants.
   */
  
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
  public final static String LAYER_HEIGHT_3D = "layerHeight3d";

  public final static double DPI_DOT_SCALE = 72.0;

  /**
   * Math
   */

  public static final double PERCENT_DIVISOR = 100;

  

}
