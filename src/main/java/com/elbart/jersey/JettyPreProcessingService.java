package com.elbart.jersey;

import de.rinderle.softvis3d.PreProcessingService;
import de.rinderle.softvis3d.domain.LayoutViewType;
import de.rinderle.softvis3d.domain.SnapshotStorageKey;
import de.rinderle.softvis3d.domain.SnapshotTreeResult;
import de.rinderle.softvis3d.domain.VisualizationRequest;
import de.rinderle.softvis3d.domain.tree.RootTreeNode;
import de.rinderle.softvis3d.domain.tree.TreeNode;
import de.rinderle.softvis3d.domain.tree.TreeNodeType;
import de.rinderle.softvis3d.domain.tree.ValueTreeNode;

/**
 * Created by stefanrinderle on 05.12.15.
 */
public class JettyPreProcessingService implements PreProcessingService {
    @Override
    public SnapshotTreeResult getProcessingResult() {

        final Integer id = 1;
        final Integer footprintMetricId = 1;
        final Integer heightMetricId = 1;
        final LayoutViewType layoutViewType = LayoutViewType.CITY;

        final VisualizationRequest requestDTO = new VisualizationRequest(id, layoutViewType, footprintMetricId, heightMetricId);
        final SnapshotStorageKey key = new SnapshotStorageKey(requestDTO);


        return new SnapshotTreeResult(key, createSampleTree(requestDTO));
    }

    private RootTreeNode createSampleTree(VisualizationRequest requestDTO) {

//    final SnapshotStorageKey key = new SnapshotStorageKey(requestDTO);
//    final SnapshotTreeResult snapshotTreeResult = new SnapshotTreeResult(key, createSampleTree(requestDTO));

        final RootTreeNode result = new RootTreeNode(requestDTO.getRootSnapshotId());

        TreeNode node2 = new ValueTreeNode(3, result, 1, TreeNodeType.TREE, "3", 1.3, 1.5, 2);
        TreeNode node3 = new ValueTreeNode(4, result, 1, TreeNodeType.TREE, "4", 1.7, 1.8, 1);
        result.addChildrenNode("3", node2);
        result.addChildrenNode("4", node3);

        return result;
    }

}
