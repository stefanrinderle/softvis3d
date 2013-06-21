/*
 * SoftViz3d Sonar plugin
 * Copyright (C) 2013 Stefan Rinderle
 * dev@sonar.codehaus.org
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
package de.rinderle.softviz3d.sonar;

public class SonarSnapshotJpa {

  Integer id;
  String name;
  Integer depth;
  Double metric1;
  Double metric2;
  
  public SonarSnapshotJpa(Integer id, String name, Integer depth, Double metric1, Double metric2) {
    super();
    this.id = id;
    this.name = name;
    this.depth = depth;
    this.metric1 = metric1;
    this.metric2 = metric2;
  }

  public Integer getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public Integer getDepth() {
    return depth;
  }

  public Double getMetric1() {
    return metric1;
  }

  public Double getMetric2() {
    return metric2;
  }

}
