/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.webservice;

import de.rinderle.softvis3d.domain.tree.Edge;
import de.rinderle.softvis3d.domain.tree.TreeNode;
import org.sonar.api.server.ws.Response;
import org.sonar.api.utils.text.JsonWriter;

import java.util.Map;

public class TreeNodeJsonWriterImpl implements TreeNodeJsonWriter {

  @Override
  public void transformTreeToJson(final Response response, final TreeNode tree) {
    final JsonWriter jsonWriter = response.newJsonWriter();

    this.transformTreeToJson(jsonWriter, tree);

    jsonWriter.close();
  }

  private void transformTreeToJson(final JsonWriter jsonWriter, final TreeNode tree) {
    jsonWriter.beginObject();

    jsonWriter.prop("id", tree.getId());
    jsonWriter.prop("name", tree.getName());
    jsonWriter.prop("heightMetricValue", tree.getHeightMetricValue());
    jsonWriter.prop("footprintMetricValue", tree.getFootprintMetricValue());
    jsonWriter.prop("isNode", tree.isNode());

    final TreeNode parent = tree.getParent();
    if (parent != null) {
      jsonWriter.name("parentInfo");
      jsonWriter.beginObject();
      jsonWriter.prop("id", parent.getId());
      jsonWriter.prop("name", parent.getName());
      jsonWriter.prop("heightMetricValue", parent.getHeightMetricValue());
      jsonWriter.prop("footprintMetricValue", parent.getFootprintMetricValue());
      jsonWriter.prop("isNode", parent.isNode());
      jsonWriter.endObject();
    }

    this.transformChildren(jsonWriter, tree.getChildren());

    this.transformEdges(jsonWriter, tree.getEdges());

    jsonWriter.endObject();
  }

  private void transformEdges(final JsonWriter jsonWriter, final Map<String, Edge> edges) {
    jsonWriter.name("edges");
    jsonWriter.beginArray();

    for (final Edge child : edges.values()) {
      this.transformEdge(jsonWriter, child);
    }

    jsonWriter.endArray();
  }

  private void transformEdge(final JsonWriter jsonWriter, final Edge edge) {
    jsonWriter.beginObject();
    jsonWriter.prop("id", edge.getSourceId() + " -> " + edge.getDestinationId());
    jsonWriter.endObject();
  }

  private void transformChildren(final JsonWriter jsonWriter, final Map<String, TreeNode> children) {
    jsonWriter.name("children");
    jsonWriter.beginArray();

    for (final TreeNode child : children.values()) {
      this.transformTreeToJson(jsonWriter, child);
    }

    jsonWriter.endArray();
  }
}
