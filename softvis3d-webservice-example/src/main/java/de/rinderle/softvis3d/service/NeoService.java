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
import de.rinderle.softvis3d.base.layout.dot.DotExecutorException;
import de.rinderle.softvis3d.neo.Neo4jClient;
import de.rinderle.softvis3d.neo.Neo4jParser;
import de.rinderle.softvis3d.neoresult.Data;
import de.rinderle.softvis3d.neoresult.Neo4jAnswer;
import de.rinderle.softvis3d.preprocessing.PathWalker;
import de.rinderle.softvis3d.preprocessing.PathWalkerDataTransformer;
import java.util.Map;

/**
 * Created by stefanrinderle on 05.12.15.
 */
public class NeoService {

  @Inject
  private VisualizationProcessor visualizationProcessor;

  @Inject
  private Neo4jClient neo4jClient;
  @Inject
  private Neo4jParser neo4jParser;
  @Inject
  private PathWalkerDataTransformer pathWalkerDataTransformer;

  public SnapshotTreeResult getNeoTree() throws Exception {
    final String jsonResult = neo4jClient.test();
    final Neo4jAnswer neoAnswer = neo4jParser.parseNeoJson(jsonResult);

    RootTreeNode tree = transformLayoutInput(neoAnswer);

    return new SnapshotTreeResult(tree);
  }

  public Map<Integer, ResultPlatform> getNeoResult(SnapshotTreeResult snapshotTreeResult) throws Exception {

    final VisualizationSettings settings = new VisualizationSettings();
    final VisualizationAdditionalInfos additionalInfos = createAdditionalInfos(snapshotTreeResult.getTree());
    try {
      return visualizationProcessor
          .visualize(LayoutViewType.CITY, settings, snapshotTreeResult, additionalInfos);
    } catch (DotExecutorException e) {
      throw new Exception(e.getMessage(), e);
    }
  }

  // TODO
  private VisualizationAdditionalInfos createAdditionalInfos(RootTreeNode tree) {
    MinMaxValue minMaxMetricFootprint = new MinMaxValue(0, 21);
    MinMaxValue minMaxMetricHeight = new MinMaxValue(0, 100);
    MinMaxValue minMaxMetricColor = new MinMaxValue(0, 100);
    int dependenciesCount = 0;

    return new VisualizationAdditionalInfos(minMaxMetricFootprint, minMaxMetricHeight, minMaxMetricColor, dependenciesCount);
  }

  private RootTreeNode transformLayoutInput(Neo4jAnswer neoAnswer) {
    final PathWalker pathWalker = new PathWalker(1);

    for (final Data data : neoAnswer.getResults().get(0).getData()) {
      pathWalker.addPath(pathWalkerDataTransformer.transform(data));
    }

    return pathWalker.getTree();
  }
}
