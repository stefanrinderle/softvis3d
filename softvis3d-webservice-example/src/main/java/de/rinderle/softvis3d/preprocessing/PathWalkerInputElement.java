/*
 * softvis3d-webservice-example
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

  public PathWalkerInputElement(final double footprintMetricValue, final double heightMetricValue, final int colorMetricValue, final String path) {
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
