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

import de.rinderle.softvis3d.neoresult.Data;
import java.util.List;
import org.apache.commons.lang.StringUtils;

/**
 * Created by stefanrinderle on 15.12.15.
 */
public class PathWalkerDataTransformer {
  public PathWalkerInputElement transform(final Data data) {

    final List<String> row = data.getRow();
    final String path = row.get(0);
    final double footprintMetricValue = getDoubleValue(row, 1);
    final double heightMetricValue = getDoubleValue(row, 2);
    final int colorMetricValue = getIntValue(row, 3);

    return new PathWalkerInputElement(footprintMetricValue, heightMetricValue, colorMetricValue, path);
  }

  private double getDoubleValue(final List<String> input, final int index) {
    if (indexExists(input, index) && StringUtils.isNotBlank(input.get(index))) {
      try {
        return Double.valueOf(input.get(index));
      } catch (final NumberFormatException exception) {
        return 0;
      }
    }
    return 0;
  }

  private int getIntValue(final List<String> input, final int index) {
    if (indexExists(input, index) && StringUtils.isNotBlank(input.get(index))) {
      try {
        return Integer.valueOf(input.get(index));
      } catch (final NumberFormatException exception) {
        return 0;
      }
    }
    return 0;
  }

  public boolean indexExists(final List list, final int index) {
    return index >= 0 && index < list.size();
  }
}
