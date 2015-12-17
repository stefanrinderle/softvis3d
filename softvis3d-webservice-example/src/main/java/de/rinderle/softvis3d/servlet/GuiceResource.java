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
    } catch (Exception e) {
      return new Gson().toJson(e);
    }
  }

  @GET
  @Path("/neo")
  @Produces(MediaType.APPLICATION_JSON)
  public String getNeo() {
    final Map<Integer, ResultPlatform> result;
    try {
      SnapshotTreeResult resultTree = neoService.getNeoTree();
      result = neoService.getNeoResult(resultTree);

      StringWriter writer = new StringWriter();
      JsonWriter jsonWriter = new JsonWriter(writer);

      writeResultsToResponse(jsonWriter, resultTree, result);
      return writer.toString();
//      return new Gson().toJson(result);
    } catch (Exception e) {
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
