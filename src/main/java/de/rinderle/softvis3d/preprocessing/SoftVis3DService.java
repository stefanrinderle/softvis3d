package de.rinderle.softvis3d.preprocessing;

import com.google.inject.Inject;
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
import de.rinderle.softvis3d.layout.dot.DotExecutorException;
import java.util.Map;

/**
 * Created by stefanrinderle on 05.12.15.
 */
public class SoftVis3DService {

    @Inject
    private VisualizationProcessor visualizationProcessor;

    public Map<Integer, ResultPlatform> getExampleResult() throws Exception {

        final VisualizationSettings settings = new VisualizationSettings();
        final VisualizationRequest requestDTO = createExampleVisualizationRequest();
        final SnapshotTreeResult snapshotTreeResult = createSnapShotTreeResult(requestDTO);

        try {
            return visualizationProcessor
                    .visualize(requestDTO.getRootSnapshotId(), settings, requestDTO, snapshotTreeResult);
        } catch (DotExecutorException e) {
            throw new Exception(e.getMessage(), e);
        }
    }

    private VisualizationRequest createExampleVisualizationRequest() {
        return new VisualizationRequest(1, LayoutViewType.CITY, 1, 20);
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
}
