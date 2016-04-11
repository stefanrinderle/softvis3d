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
package de.rinderle.softvis3d.webservice.jsonwriter;

import de.rinderle.softvis3d.base.domain.graph.BaseResultObject;
import de.rinderle.softvis3d.base.domain.graph.Point3d;
import de.rinderle.softvis3d.base.domain.graph.ResultArrow;
import de.rinderle.softvis3d.base.domain.graph.ResultBuilding;
import de.rinderle.softvis3d.base.domain.graph.ResultPlatform;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import org.sonar.api.utils.text.JsonWriter;

public class SonarVisualizationJsonWriter {

  public void transformResponseToJson(final JsonWriter jsonWriter, final Map<Integer, ResultPlatform> results) {
    jsonWriter.beginObject();

    jsonWriter.name("visualizationResult");
    jsonWriter.beginArray();

    for (final Map.Entry<Integer, ResultPlatform> entry : results.entrySet()) {
      transformPlatform(jsonWriter, entry.getKey(), entry.getValue());
    }

    jsonWriter.endArray();
    jsonWriter.endObject();
  }

  private void transformPlatform(final JsonWriter jsonWriter, final Integer id, final ResultPlatform platform) {
    jsonWriter.beginObject();

    jsonWriter.prop("platformId", id);

    transformBaseObjectProperties(jsonWriter, platform);

    jsonWriter.prop("positionX", platform.getBoundingBox().getX());
    jsonWriter.prop("positionY", platform.getBoundingBox().getY());

    jsonWriter.prop("width", platform.getBoundingBox().getWidth());
    jsonWriter.prop("platformHeight", platform.getPlatformHeight());
    jsonWriter.prop("height", platform.getBoundingBox().getHeight());

    transformNodes(jsonWriter, platform.getNodes());

    jsonWriter.endObject();
  }

  private void transformBaseObjectProperties(final JsonWriter jsonWriter, final BaseResultObject baseResultObject) {
    jsonWriter.prop("opacity", baseResultObject.getOpacity());

    if (baseResultObject.getColor() != null) {
      jsonWriter.prop("color", baseResultObject.getColor().getHex());
    }

    jsonWriter.prop("height3d", baseResultObject.getHeight3d());
  }

  private void transformNodes(final JsonWriter jsonWriter, final Collection<ResultBuilding> nodes) {
    jsonWriter.name("nodes");
    jsonWriter.beginArray();

    for (final ResultBuilding node : nodes) {
      transformNode(jsonWriter, node);
    }

    jsonWriter.endArray();
  }

  private void transformNode(final JsonWriter jsonWriter, final ResultBuilding node) {
    jsonWriter.beginObject();

    jsonWriter.prop("id", node.getId());
    jsonWriter.prop("buildingHeight", node.getBuildingHeight());
    jsonWriter.prop("height", node.getHeight());
    jsonWriter.prop("width", node.getWidth());

    jsonWriter.prop("positionX", node.getPosition().getX());
    jsonWriter.prop("positionY", node.getPosition().getY());

    jsonWriter.prop("type", node.getType().name());

    transformBaseObjectProperties(jsonWriter, node);

    transformArrows(jsonWriter, node.getArrows());

    jsonWriter.endObject();
  }

  private void transformArrows(final JsonWriter jsonWriter, final List<ResultArrow> arrows) {
    jsonWriter.name("arrows");
    jsonWriter.beginArray();

    for (final ResultArrow arrow : arrows) {
      transformArrow(jsonWriter, arrow);
    }

    jsonWriter.endArray();
  }

  private void transformArrow(final JsonWriter jsonWriter, final ResultArrow arrow) {
    jsonWriter.beginObject();

    jsonWriter.prop("id", arrow.getId());

    jsonWriter.prop("headId", arrow.getHeadId());
    jsonWriter.prop("tailId", arrow.getTailId());

    jsonWriter.prop("radius", arrow.getRadius());

    transformBaseObjectProperties(jsonWriter, arrow);

    transformArrowPoints(jsonWriter, arrow.getLinePoints());

    jsonWriter.endObject();
  }

  private void transformArrowPoints(final JsonWriter jsonWriter, final List<Point3d> translatedPoints) {
    jsonWriter.name("translatedPoints");
    jsonWriter.beginArray();

    for (final Point3d point : translatedPoints) {
      transformPoint(jsonWriter, point);
    }

    jsonWriter.endArray();
  }

  private void transformPoint(final JsonWriter jsonWriter, final Point3d point) {
    jsonWriter.beginObject();

    jsonWriter.prop("x", point.getX());
    jsonWriter.prop("y", point.getY());
    jsonWriter.prop("z", point.getZ());

    jsonWriter.endObject();
  }

}
