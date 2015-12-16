package de.rinderle.softvis3d.preprocessing;

import java.util.regex.Pattern;

/**
 * Created by stefanrinderle on 15.12.15.
 */
public class PathWalkerInputElement {

  private final Pattern pathSeparator = Pattern.compile("\\.");

  private final double footprintMetricValue;
  private final double heightMetricValue;
  private final int colorMetricValue;
  private final String path;

  public PathWalkerInputElement(double footprintMetricValue, double heightMetricValue, int colorMetricValue, String path) {
    this.footprintMetricValue = footprintMetricValue;
    this.heightMetricValue = heightMetricValue;
    this.colorMetricValue = colorMetricValue;
    this.path = path;
  }

  public double getFootprintMetricValue() {
    return footprintMetricValue;
  }

  public double getHeightMetricValue() {
    return heightMetricValue;
  }

  public int getColorMetricValue() {
    return colorMetricValue;
  }

  public String getPath() {
    return path;
  }

  public String[] getSplittedPath() {
    return this.pathSeparator.split(this.getPath());
  }


}
