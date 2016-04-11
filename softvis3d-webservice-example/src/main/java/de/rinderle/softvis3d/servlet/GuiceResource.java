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
import de.rinderle.softvis3d.base.layout.helper.StringOutputStream;
import de.rinderle.softvis3d.base.result.SoftVis3dJsonWriter;
import de.rinderle.softvis3d.base.result.TreeNodeJsonWriter;
import de.rinderle.softvis3d.base.result.VisualizationJsonWriter;
import de.rinderle.softvis3d.service.LayoutExampleService;
import de.rinderle.softvis3d.service.NeoService;
import java.util.Map;
import javax.ws.rs.GET;
import javax.ws.rs.OPTIONS;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
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

    final Map<String, ResultPlatform> result;
    try {
      result = layoutExampleService.getExampleResult();
      SnapshotTreeResult resultTree = layoutExampleService.getExampleResultTree();

      final StringOutputStream stringOutputStream = new StringOutputStream();
      final SoftVis3dJsonWriter jsonWriter = new SoftVis3dJsonWriter(stringOutputStream);

      writeResultsToResponse(jsonWriter, resultTree, result);
      return stringOutputStream.toString();
    } catch (final Exception e) {
      return new Gson().toJson(e.getMessage());
    }
  }

  @GET
  @Path("/neostatic")
  @Produces(MediaType.APPLICATION_JSON)
  public String getNeoStatic() {
    final Map<String, ResultPlatform> result;
    try {
      final SnapshotTreeResult resultTree = neoService.getNeoTreeStatic();
      result = neoService.getNeoResult(resultTree);

      final StringOutputStream stringOutputStream = new StringOutputStream();
      final SoftVis3dJsonWriter jsonWriter = new SoftVis3dJsonWriter(stringOutputStream);

      writeResultsToResponse(jsonWriter, resultTree, result);
      return stringOutputStream.toString();
    } catch (final Exception e) {
      return new Gson().toJson(e.getMessage());
    }
  }

  @GET
  @Path("/neoDynamic")
  @Produces(MediaType.APPLICATION_JSON)
  public String getNeoDynamic(@QueryParam("cypher") String cypher) {
    final Map<String, ResultPlatform> result;
    try {
      final SnapshotTreeResult resultTree = neoService.getNeoTree(cypher);

      result = neoService.getNeoResult(resultTree);

      final StringOutputStream stringOutputStream = new StringOutputStream();
      final SoftVis3dJsonWriter jsonWriter = new SoftVis3dJsonWriter(stringOutputStream);

      writeResultsToResponse(jsonWriter, resultTree, result);
      return stringOutputStream.toString();
    } catch (final Exception e) {
      return new Gson().toJson(e.getMessage());
    }
  }

  private void writeResultsToResponse(final SoftVis3dJsonWriter jsonWriter, final SnapshotTreeResult snapshotTreeResult,
                                      final Map<String, ResultPlatform> visualizationResult) {

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
