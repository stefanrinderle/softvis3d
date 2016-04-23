/*
 * SoftVis3D Sonar plugin
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
package de.rinderle.softvis3d.domain.sonar;

public class SonarMeasure {

  private final String id;
  private final String name;
  private final double footprintMetricValue;
  private final double heightMetricValue;
  private final double colorMetricValue;
  private String path;

  public SonarMeasure(String id, String name, String path, double footprintMetricValue, double heightMetricValue, double colorMetricValue) {
    this.id = id;
    this.name = name;
    this.path = path;
    this.footprintMetricValue = footprintMetricValue;
    this.heightMetricValue = heightMetricValue;
    this.colorMetricValue = colorMetricValue;
  }

  public String getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public double getFootprintMetricValue() {
    return footprintMetricValue;
  }

  public double getHeightMetricValue() {
    return heightMetricValue;
  }

  public double getColorMetricValue() {
    return colorMetricValue;
  }

  public String getPath() {
    return path;
  }

  public void setPath(String path) {
    this.path = path;
  }

  @Override
  public String toString() {
    return "SonarMeasure{" +
        "id='" + id + '\'' +
        ", footprintMetricValue=" + footprintMetricValue +
        ", heightMetricValue=" + heightMetricValue +
        ", colorMetricValue=" + colorMetricValue +
        ", path='" + path + '\'' +
        '}';
  }

}
