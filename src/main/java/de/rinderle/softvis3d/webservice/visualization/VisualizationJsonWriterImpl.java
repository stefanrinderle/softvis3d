/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.webservice.visualization;

import de.rinderle.softvis3d.domain.graph.*;
import org.sonar.api.server.ws.Response;
import org.sonar.api.utils.text.JsonWriter;

import java.util.Collection;
import java.util.List;
import java.util.Map;

public class VisualizationJsonWriterImpl implements VisualizationJsonWriter {

	@Override
	public void transformResponseToJson(final Response response,
			final Map<Integer, ResultPlatform> results) {
		final JsonWriter jsonWriter = response.newJsonWriter();

		this.transformResponseToJson(jsonWriter, results);

		jsonWriter.close();
	}

	private void transformResponseToJson(JsonWriter jsonWriter,
			Map<Integer, ResultPlatform> results) {
		jsonWriter.beginObject();

		jsonWriter.name("webserviceResult");
		jsonWriter.beginArray();

		for (Map.Entry<Integer, ResultPlatform> entry : results.entrySet()) {
			transformPlatform(jsonWriter, entry.getKey(), entry.getValue());
		}

		jsonWriter.endArray();
		jsonWriter.endObject();
	}

	private void transformPlatform(final JsonWriter jsonWriter,
			final Integer id, final ResultPlatform platform) {
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

	private void transformBaseObjectProperties(final JsonWriter jsonWriter,
			final BaseResultObject baseResultObject) {
		jsonWriter.prop("opacity", baseResultObject.getOpacity());

		if (baseResultObject.getColor() != null) {
			jsonWriter.prop("color", baseResultObject.getColor().getHex());
		}

		jsonWriter.prop("height3d", baseResultObject.getHeight3d());
	}

	private void transformNodes(JsonWriter jsonWriter,
			Collection<ResultBuilding> nodes) {
		jsonWriter.name("nodes");
		jsonWriter.beginArray();

		for (final ResultBuilding node : nodes) {
			transformNode(jsonWriter, node);
		}

		jsonWriter.endArray();
	}

	private void transformNode(JsonWriter jsonWriter, ResultBuilding node) {
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

	private void transformArrows(JsonWriter jsonWriter, List<ResultArrow> arrows) {
		jsonWriter.name("arrows");
		jsonWriter.beginArray();

		for (final ResultArrow arrow : arrows) {
			transformArrow(jsonWriter, arrow);
		}

		jsonWriter.endArray();
	}

	private void transformArrow(JsonWriter jsonWriter, ResultArrow arrow) {
		jsonWriter.beginObject();

		jsonWriter.prop("id", arrow.getId());

		jsonWriter.prop("headId", arrow.getHeadId());
		jsonWriter.prop("tailId", arrow.getTailId());

		jsonWriter.prop("radius", arrow.getRadius());

		transformBaseObjectProperties(jsonWriter, arrow);

		transformArrowPoints(jsonWriter, arrow.getLinePoints());

		jsonWriter.endObject();
	}

	private void transformArrowPoints(JsonWriter jsonWriter,
			List<Point3d> translatedPoints) {
		jsonWriter.name("translatedPoints");
		jsonWriter.beginArray();

		for (final Point3d point : translatedPoints) {
			transformPoint(jsonWriter, point);
		}

		jsonWriter.endArray();
	}

	private void transformPoint(JsonWriter jsonWriter, Point3d point) {
		jsonWriter.beginObject();

		jsonWriter.prop("x", point.getX());
		jsonWriter.prop("y", point.getY());
		jsonWriter.prop("z", point.getZ());

		jsonWriter.endObject();
	}

}
