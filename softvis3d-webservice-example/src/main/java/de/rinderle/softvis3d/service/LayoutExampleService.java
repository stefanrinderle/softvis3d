package de.rinderle.softvis3d.service;

import com.google.inject.Inject;
import de.rinderle.softvis3d.base.VisualizationAdditionalInfos;
import de.rinderle.softvis3d.base.VisualizationProcessor;
import de.rinderle.softvis3d.base.VisualizationSettings;
import de.rinderle.softvis3d.base.domain.LayoutViewType;
import de.rinderle.softvis3d.base.domain.MinMaxValue;
import de.rinderle.softvis3d.base.domain.SnapshotTreeResult;
import de.rinderle.softvis3d.base.domain.graph.ResultPlatform;
import de.rinderle.softvis3d.base.domain.tree.RootTreeNode;
import de.rinderle.softvis3d.base.domain.tree.TreeNode;
import de.rinderle.softvis3d.base.domain.tree.TreeNodeType;
import de.rinderle.softvis3d.base.domain.tree.ValueTreeNode;
import de.rinderle.softvis3d.base.layout.dot.DotExecutorException;
import java.util.Map;

/**
 * Created by stefanrinderle on 15.12.15.
 */
public class LayoutExampleService {

  @Inject
  private VisualizationProcessor visualizationProcessor;

  public Map<Integer, ResultPlatform> getExampleResult() throws Exception {
    final VisualizationSettings settings = new VisualizationSettings();
    final SnapshotTreeResult snapshotTreeResult = createExampleSnapshotTreeResult(1);
    final VisualizationAdditionalInfos additionalInfos = createExampleAdditionalInfos();
    try {
      return visualizationProcessor
          .visualize(LayoutViewType.CITY, settings, snapshotTreeResult, additionalInfos);
    } catch (DotExecutorException e) {
      throw new Exception(e.getMessage(), e);
    }
  }

  private SnapshotTreeResult createExampleSnapshotTreeResult(final int rootId) {
    final RootTreeNode result = new RootTreeNode(rootId);

    TreeNode node2 = new ValueTreeNode(2, result, 1, TreeNodeType.TREE, "2", 1.3, 1.5, 2);
    TreeNode node3 = new ValueTreeNode(3, result, 1, TreeNodeType.TREE, "3", 1.7, 1.8, 1);
    result.addChildrenNode("2", node2);
    result.addChildrenNode("3", node3);

    return new SnapshotTreeResult(result);
  }

  private VisualizationAdditionalInfos createExampleAdditionalInfos() {
    MinMaxValue minMaxFootprint = new MinMaxValue(0, 3);
    MinMaxValue minMaxHeight = new MinMaxValue(0, 3);
    MinMaxValue minMaxColor = new MinMaxValue(0, 3);
    int dependencyCount = 0;

    return new VisualizationAdditionalInfos(minMaxFootprint, minMaxHeight, minMaxColor, dependencyCount);
  }


}
