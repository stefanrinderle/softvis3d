/*
 * SoftViz3d Sonar plugin
 * Copyright (C) 2013 Rinderle
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
package de.rinderle.softviz3d.helper;

public class Point3d {

  private double x;
  private double y;
  private double z;

  public Point3d(double x, double y, double z) {
    super();
    this.x = x;
    this.y = y;
    this.z = z;
  }

  // format "x, y, z"
  public Point3d(String values) {
    String[] spittedString = values.split(",");
    this.x = Double.valueOf(spittedString[0]);
    this.y = Double.valueOf(spittedString[1]);
    this.z = Double.valueOf(spittedString[2]);
  }

  public double getX() {
    return x;
  }

  public void setX(double x) {
    this.x = x;
  }

  public double getY() {
    return y;
  }

  public void setY(double y) {
    this.y = y;
  }

  public double getZ() {
    return z;
  }

  public void setZ(double z) {
    this.z = z;
  }

  @Override
  public String toString() {
    return x + "," + y + "," + z;
  }

}
