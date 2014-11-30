/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.domain.sonar;

public class SonarSnapshot {

  private final int id;
  private final String path;
  private final double footprintMetricValue;
  private final double heightMetricValue;

  public SonarSnapshot(int id, String path, double footprintMetricValue, double heightMetricValue) {
    this.id = id;
    this.path = path;
    this.footprintMetricValue = footprintMetricValue;
    this.heightMetricValue = heightMetricValue;
  }

  public int getId() {
    return id;
  }

  public String getPath() {
    return path;
  }

  public double getFootprintMetricValue() {
    return footprintMetricValue;
  }

  public double getHeightMetricValue() {
    return heightMetricValue;
  }

}
