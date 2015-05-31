/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
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
package de.rinderle.softvis3d.layout.format;

import de.rinderle.softvis3d.SoftVis3DPlugin;
import de.rinderle.softvis3d.domain.LayoutViewType;
import de.rinderle.softvis3d.domain.MinMaxValue;
import de.rinderle.softvis3d.domain.SoftVis3DConstants;
import de.rinderle.softvis3d.domain.graph.ResultBuilding;
import de.rinderle.softvis3d.domain.graph.ResultPlatform;
import de.rinderle.softvis3d.domain.tree.TreeNodeType;
import de.rinderle.softvis3d.domain.tree.ValueTreeNode;
import de.rinderle.softvis3d.layout.helper.HexaColor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class LayerFormatterBean implements LayerFormatter {

  private static final Logger LOGGER = LoggerFactory.getLogger(LayerFormatterBean.class);

  private static final int BASE_PLATFORM_BRIGHTNESS = 50;
  private static final int MAX_COLOR_VALUE = 254;

  @Override
  public void format(final ResultPlatform platform, final Integer depth, final LayoutViewType viewType) {
    double opacity = 1.0;
    Integer height3d = depth * 20;

    if (LayoutViewType.DEPENDENCY.equals(viewType)) {
      height3d = -(depth * SoftVis3DConstants.LAYER_HEIGHT);
      opacity = 0.7;
    }

    platform.setOpacity(opacity);

    platform.setHeight3d(height3d);

    platform.setColor(getPlatformBaseColor(depth));

    for (final ResultBuilding leaf : platform.getNodes()) {
      formatResultBuilding(depth, height3d, leaf);
    }
  }

  @Override
  public HexaColor getPlatformBaseColor(int depth) {
    // calc color
    int colorCalc = depth * 32;
    if (colorCalc > (MAX_COLOR_VALUE - BASE_PLATFORM_BRIGHTNESS) || colorCalc < 0) {
      colorCalc = MAX_COLOR_VALUE - BASE_PLATFORM_BRIGHTNESS;
    }

    final int colorValue = BASE_PLATFORM_BRIGHTNESS + colorCalc;
    return new HexaColor(colorValue, colorValue, colorValue);
  }

  private void formatResultBuilding(int depth, Integer height3d, ResultBuilding leaf) {
    double width = leaf.getWidth();
    // keep some distance to each other
    width = width * SoftVis3DConstants.DPI_DOT_SCALE;
    leaf.setWidth(width);

    double height = leaf.getHeight();
    // keep some distance to each other
    height = height * SoftVis3DConstants.DPI_DOT_SCALE;
    leaf.setHeight((height));

    if (leaf.getType().equals(TreeNodeType.DEPENDENCY_GENERATED)) {
      leaf.setColor(getPlatformBaseColor(depth));
    }

    leaf.setHeight3d(height3d);
  }

  /**
   * Building height is calculated in percent.
   *
   * @param value
   *            Metric value for the building size
   * @return percent 0-100%
   */
  @Override
  public double calcBuildingHeight(final Double value, final MinMaxValue minMaxMetricHeight) {
    double buildingHeight = this.calcPercentage(value, minMaxMetricHeight);

    if (buildingHeight < SoftVis3DConstants.MIN_BUILDING_HEIGHT) {
      buildingHeight = SoftVis3DConstants.MIN_BUILDING_HEIGHT;
    }

    return buildingHeight;
  }

  @Override
  public double calcSideLength(final Double value, final MinMaxValue minMaxMetricFootprint) {
    double sideLength = this.calcPercentage(value, minMaxMetricFootprint);

    if (sideLength < SoftVis3DConstants.MIN_SIDE_LENGTH) {
      sideLength = SoftVis3DConstants.MIN_SIDE_LENGTH;
    }

    return sideLength;
  }

  @Override
  public double calcEdgeRadius(int counter) {
    return counter;
  }

  @Override
  public HexaColor getScmColorInfo(final ValueTreeNode leafNode, final int maxScmValue) {

    if (SoftVis3DPlugin.HAS_SCM_FEATURE) {
      return makeColor(leafNode.getAuthorCount(), maxScmValue);
    } else {
      return SoftVis3DConstants.BUILDING_COLOR;
    }
  }

  /**
   * Value between 0 and 510.
   */
  private HexaColor makeColor(int authorCount, double maxScmValue) {
    int valueBetween0And510 = (int) (((double) authorCount / maxScmValue) * 510);

    int newGreenValue;
    int newRedValue;
    if (valueBetween0And510 < 255) {
      newGreenValue = 255;
      double newRedValueTemp = Math.sqrt(valueBetween0And510) * 16;
      newRedValue = (int) Math.round(newRedValueTemp);
    } else {
      newRedValue = 255;
      valueBetween0And510 = valueBetween0And510 - 255;
      newGreenValue = 255 - (valueBetween0And510 * valueBetween0And510 / 255);
      newGreenValue = Math.round(newGreenValue);
    }

    return new HexaColor(newRedValue, newGreenValue, 0);
  }

  private double calcPercentage(final Double value, final MinMaxValue minMaxDao) {
    double result = 0.0;
    if (value != null) {
      final Double minValue = minMaxDao.getMinValue();
      final Double maxValue = minMaxDao.getMaxValue();

      final Double rangeSize = maxValue - minValue;
      if (rangeSize < 0) {
        LOGGER.error("CalcPercentage range size below zero" + rangeSize);
      } else {
        if (value >= minValue && value <= maxValue) {
          result = 100 / rangeSize * (value - minValue);
        } else {
          LOGGER.warn("CalcPercentage value not between min and max " + value + " " + minValue + " "
            + maxValue);
        }
      }
    }
    return result;
  }

}
