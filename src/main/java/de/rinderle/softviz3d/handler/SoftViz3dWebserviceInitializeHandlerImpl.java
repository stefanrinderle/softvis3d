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
package de.rinderle.softviz3d.handler;

import com.google.inject.Inject;
import de.rinderle.softviz3d.layout.calc.DependencyExpander;
import de.rinderle.softviz3d.layout.calc.Edge;
import de.rinderle.softviz3d.layout.calc.LayoutViewType;
import de.rinderle.softviz3d.sonar.DependencyDao;
import de.rinderle.softviz3d.sonar.SonarDependency;
import de.rinderle.softviz3d.tree.ResourceTreeService;
import de.rinderle.softviz3d.tree.TreeNode;
import org.sonar.api.server.ws.Request;
import org.sonar.api.server.ws.Response;
import org.sonar.api.utils.text.JsonWriter;

import java.util.List;
import java.util.Map;

public class SoftViz3dWebserviceInitializeHandlerImpl implements SoftViz3dWebserviceInitializeHandler {

  @Inject
  private ResourceTreeService resourceTreeService;
  @Inject
  private DependencyExpander dependencyExpander;
  @Inject
  private DependencyDao dependencyDao;

  @Override
  public void handle(final Request request, final Response response) {
    final Integer id = Integer.valueOf(request.param("snapshotId"));
    final Integer footprintMetricId = Integer.valueOf(request.param("footprintMetricId"));
    final Integer heightMetricId = Integer.valueOf(request.param("heightMetricId"));

    final String viewType = request.param("viewType");
    final LayoutViewType type;
    if ("city".equals(viewType)) {
      type = LayoutViewType.CITY;
    } else {
      type = LayoutViewType.DEPENDENCY;
    }

    // TODO: do in one step
    final TreeNode tree = resourceTreeService.createTreeStructure(type, id, footprintMetricId, heightMetricId);
    if (LayoutViewType.DEPENDENCY.equals(type)) {
      final List<SonarDependency> dependencies = dependencyDao.getDependencies(id);
      dependencyExpander.execute(id, dependencies);
    }

    final JsonWriter jsonWriter = response.newJsonWriter();

    transformTreeToJson(jsonWriter, tree);

    jsonWriter.close();
  }

  // TODO: refactor json transformation to a new class.
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

    transformChildren(jsonWriter, tree.getChildren());

    transformEdges(jsonWriter, tree.getEdges());

    jsonWriter.endObject();
  }

  private void transformEdges(final JsonWriter jsonWriter, final Map<String, Edge> edges) {
    jsonWriter.name("edges");
    jsonWriter.beginArray();

    for (final Edge child : edges.values()) {
      transformEdge(jsonWriter, child);
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
      transformTreeToJson(jsonWriter, child);
    }

    jsonWriter.endArray();
  }
}
