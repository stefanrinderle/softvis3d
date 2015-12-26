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
package de.rinderle.softvis3d.servlet;

import com.google.gson.Gson;
import com.google.inject.Inject;
import com.google.inject.servlet.RequestScoped;
import de.rinderle.softvis3d.base.domain.SnapshotTreeResult;
import de.rinderle.softvis3d.base.domain.graph.ResultPlatform;
import de.rinderle.softvis3d.service.JsonWriter;
import de.rinderle.softvis3d.service.LayoutExampleService;
import de.rinderle.softvis3d.service.NeoService;
import de.rinderle.softvis3d.service.TreeNodeJsonWriter;
import de.rinderle.softvis3d.service.VisualizationJsonWriter;
import java.io.StringWriter;
import java.util.Map;
import javax.ws.rs.GET;
import javax.ws.rs.OPTIONS;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Path("/api")
@RequestScoped
public class GuiceResource {

  @Inject
  private NeoService neoService;
  @Inject
  private LayoutExampleService layoutExampleService;
  @Inject
  private VisualizationJsonWriter visualizationJsonWriter;
  @Inject
  private TreeNodeJsonWriter treeNodeJsonWriter;

  @GET
  @Path("/example")
  @Produces(MediaType.APPLICATION_JSON)
  public String getExample() {

    final Map<Integer, ResultPlatform> result;
    try {
      result = layoutExampleService.getExampleResult();
      return new Gson().toJson(result);
    } catch (final Exception e) {
      return new Gson().toJson(e);
    }
  }

  @GET
  @Path("/neostatic")
  @Produces(MediaType.APPLICATION_JSON)
  public String getNeoStatic() {
    final Map<Integer, ResultPlatform> result;
    try {
      final SnapshotTreeResult resultTree = neoService.getNeoTreeStatic();
      result = neoService.getNeoResult(resultTree);

      final StringWriter writer = new StringWriter();
      final JsonWriter jsonWriter = new JsonWriter(writer);

      writeResultsToResponse(jsonWriter, resultTree, result);
      return writer.toString();
    } catch (final Exception e) {
      return new Gson().toJson(e);
    }
  }

  @GET
  @Path("/neo")
  @Produces(MediaType.APPLICATION_JSON)
  public String getNeo() {
    final Map<Integer, ResultPlatform> result;
    try {
      final SnapshotTreeResult resultTree = neoService.getNeoTree();
      result = neoService.getNeoResult(resultTree);

      final StringWriter writer = new StringWriter();
      final JsonWriter jsonWriter = new JsonWriter(writer);

      writeResultsToResponse(jsonWriter, resultTree, result);
      return writer.toString();
    } catch (final Exception e) {
      return new Gson().toJson(e);
    }
  }

  private void writeResultsToResponse(final JsonWriter jsonWriter, final SnapshotTreeResult snapshotTreeResult,
                                      final Map<Integer, ResultPlatform> visualizationResult) {

    jsonWriter.beginObject();
    jsonWriter.name("resultObject");

    jsonWriter.beginArray();

    this.treeNodeJsonWriter.transformRootTreeToJson(jsonWriter, snapshotTreeResult.getTree());
    this.visualizationJsonWriter.transformResponseToJson(jsonWriter, visualizationResult);

    jsonWriter.endArray();

    jsonWriter.endObject();

    jsonWriter.close();
  }

  @OPTIONS
  @Path("/example")
  @Produces(MediaType.APPLICATION_XML)
  public String getSupportedOperations() {
    return "<operations>GET, POST</operations>";
  }

}
