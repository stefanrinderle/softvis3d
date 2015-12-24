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
package de.rinderle.softvis3d.base;

import de.rinderle.softvis3d.base.domain.MinMaxValue;

/**
 * Created by stefanrinderle on 05.12.15.
 */
public class VisualizationAdditionalInfos {
  private final MinMaxValue minMaxMetricFootprint;
  private final MinMaxValue minMaxMetricHeight;
  private final int dependenciesCount;
  private final MinMaxValue minMaxMetricColor;

  public VisualizationAdditionalInfos(MinMaxValue minMaxMetricFootprint, MinMaxValue minMaxMetricHeight,
    MinMaxValue minMaxMetricColor, int dependenciesCount) {
    this.minMaxMetricFootprint = minMaxMetricFootprint;
    this.minMaxMetricHeight = minMaxMetricHeight;
    this.dependenciesCount = dependenciesCount;
    this.minMaxMetricColor = minMaxMetricColor;
  }

  public MinMaxValue getMinMaxMetricFootprint() {
    return minMaxMetricFootprint;
  }

  public MinMaxValue getMinMaxMetricHeight() {
    return minMaxMetricHeight;
  }

  public int getDependenciesCount() {
    return dependenciesCount;
  }

  public MinMaxValue getMinMaxMetricColor() {
    return minMaxMetricColor;
  }

  @Override
  public String toString() {
    return "VisualizationAdditionalInfos{" +
            "minMaxMetricFootprint=" + minMaxMetricFootprint +
            ", minMaxMetricHeight=" + minMaxMetricHeight +
            ", dependenciesCount=" + dependenciesCount +
            ", minMaxMetricColor=" + minMaxMetricColor +
            '}';
  }
}
