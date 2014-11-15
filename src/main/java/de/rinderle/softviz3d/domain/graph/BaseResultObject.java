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
package de.rinderle.softviz3d.domain.graph;

public abstract class BaseResultObject {

  private double opacity;
  private int height3d;

  public void setOpacity(double opacity) {
    this.opacity = opacity;
  }

  public double getOpacity() {
    return opacity;
  }

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
  public void setHeight3d(int height3d) {
    this.height3d = height3d;
  }

  /**
   * called from view.
   */
  public int getHeight3d() {
    return height3d;
  }

}
