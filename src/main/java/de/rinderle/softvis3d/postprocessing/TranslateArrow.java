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
package de.rinderle.softvis3d.postprocessing;

import att.grappa.GrappaBox;
import att.grappa.GrappaPoint;
import de.rinderle.softvis3d.domain.graph.Point3d;
import de.rinderle.softvis3d.domain.graph.ResultArrow;
import de.rinderle.softvis3d.domain.graph.ResultPlatform;

import java.util.ArrayList;
import java.util.List;

public class TranslateArrow {

  public void translate(final ResultArrow arrow, final GrappaPoint posTranslation, final GrappaBox translatedBb, final int height3d) {
    final List<Point3d> result = new ArrayList<>();

    final double arrowHeight = calc3dArrowPosition(arrow, height3d);

    for (final Point3d point : arrow.getLinePoints()) {
      final Point3d temp = translateLinePoint(posTranslation, translatedBb, arrowHeight, point);
      result.add(temp);
    }

    arrow.setPoints(result);
  }

  private Point3d translateLinePoint(final GrappaPoint posTranslation, final GrappaBox translatedBb, final double arrowHeight,
    final Point3d point) {

    final double x = posTranslation.getX() + point.getX() - translatedBb.getWidth() / 2;
    final double z = posTranslation.getY() + point.getZ() + translatedBb.getHeight() / 2;

    return new Point3d(x, arrowHeight, z);
  }

  private double calc3dArrowPosition(final ResultArrow arrow, final int height3d) {
    final double result = height3d + ResultPlatform.PLATFORM_HEIGHT;
    final double diameter = (2 * 3.14) / arrow.getRadius();

    return result + diameter;
  }
}
