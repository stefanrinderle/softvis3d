package com.elbart.jersey;

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
  private VisualizationProcessor visualizationProcessor;

  private static final String SUCCESS_RESULT = "<result>success</result>";
  private static final String FAILURE_RESULT = "<result>failure</result>";

  @GET
  @Path("/users")
  @Produces(MediaType.APPLICATION_JSON)
  public String getUsers() {

    try {
      VisualizationSettings settings = new VisualizationSettings();
      VisualizationRequest requestDTO =
              new VisualizationRequest(1, LayoutViewType.CITY, 1, 20);
      SnapshotTreeResult snapshotTreeResult = createSnapShotTreeResult(requestDTO);

      Map<Integer, ResultPlatform> result = visualizationProcessor.visualize(1, settings, requestDTO, snapshotTreeResult);

      return new Gson().toJson(result);
    } catch (Exception e) {
      e.printStackTrace();
      return null;
    }
  }

  private SnapshotTreeResult createSnapShotTreeResult(VisualizationRequest requestDTO ) {
      final RootTreeNode result = new RootTreeNode(requestDTO.getRootSnapshotId());

      TreeNode node2 = new ValueTreeNode(2, result, 1, TreeNodeType.TREE, "2", 1.3, 1.5, 2);
      TreeNode node3 = new ValueTreeNode(3, result, 1, TreeNodeType.TREE, "3", 1.7, 1.8, 1);
      result.addChildrenNode("2", node2);
      result.addChildrenNode("3", node3);

    SnapshotStorageKey key = new SnapshotStorageKey(requestDTO);
    return new SnapshotTreeResult(key, result);
  }

  @OPTIONS
  @Path("/users")
  @Produces(MediaType.APPLICATION_XML)
  public String getSupportedOperations() {
    return "<operations>GET, POST</operations>";
  }

}
