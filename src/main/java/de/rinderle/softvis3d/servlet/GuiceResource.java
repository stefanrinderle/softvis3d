package de.rinderle.softvis3d.servlet;

import com.google.gson.Gson;
import com.google.inject.Inject;
import com.google.inject.servlet.RequestScoped;
import de.rinderle.softvis3d.VisualizationProcessor;
import de.rinderle.softvis3d.VisualizationSettings;
import de.rinderle.softvis3d.domain.LayoutViewType;
import de.rinderle.softvis3d.domain.SnapshotStorageKey;
import de.rinderle.softvis3d.domain.SnapshotTreeResult;
import de.rinderle.softvis3d.domain.VisualizationRequest;
import de.rinderle.softvis3d.domain.graph.ResultPlatform;
import de.rinderle.softvis3d.domain.tree.RootTreeNode;
import de.rinderle.softvis3d.domain.tree.TreeNode;
import de.rinderle.softvis3d.domain.tree.TreeNodeType;
import de.rinderle.softvis3d.domain.tree.ValueTreeNode;
import de.rinderle.softvis3d.preprocessing.PreProcessor;
import de.rinderle.softvis3d.preprocessing.SoftVis3DService;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import javax.ws.rs.GET;
import javax.ws.rs.OPTIONS;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Path("/")
@RequestScoped
public class GuiceResource {

  @Inject
  private SoftVis3DService softVis3DService;

  @GET
  @Path("/example")
  @Produces(MediaType.APPLICATION_JSON)
  public String getExample() {

    final Map<Integer, ResultPlatform> result;
    try {
      result = softVis3DService.getExampleResult();
      return new Gson().toJson(result);
    } catch (Exception e) {
      return new Gson().toJson(e);
    }

  }

  @OPTIONS
  @Path("/example")
  @Produces(MediaType.APPLICATION_XML)
  public String getSupportedOperations() {
    return "<operations>GET, POST</operations>";
  }

}
