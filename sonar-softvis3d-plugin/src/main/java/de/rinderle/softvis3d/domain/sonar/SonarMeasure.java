/**
 * SoftVis3D Sonar plugin
 * Copyright (C) 2016 Stefan Rinderle and Yvo Niedrich
 * stefan@rinderle.info / yvo.niedrich@gmail.com
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

import java.util.Map;

public class SonarMeasure {

  private final String id;
  private final String name;
  private final Map<String, Double> metrics;
  private String path;

  public SonarMeasure(String id, String name, String path, Map<String, Double> metrics) {
    this.id = id;
    this.name = name;
    this.path = path;
    this.metrics = metrics;
  }

  public String getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public String getPath() {
    return path;
  }

  public void setPath(String path) {
    this.path = path;
  }

  public Map<String, Double> getMetrics() {
    return metrics;
  }

  @Override
  public String toString() {
    return "SonarMeasure{" + "id='" + id + '\'' + ", name='" + name + '\'' + ", metrics=" + metrics + ", path='" + path
        + '\'' + '}';
  }

}
