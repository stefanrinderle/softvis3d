/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.postprocessing;

import att.grappa.GrappaBox;
import att.grappa.GrappaPoint;
import de.rinderle.softvis3d.domain.LayoutViewType;
import de.rinderle.softvis3d.domain.SnapshotTreeResult;
import de.rinderle.softvis3d.domain.graph.Point3d;
import de.rinderle.softvis3d.domain.graph.ResultArrow;
import de.rinderle.softvis3d.domain.graph.ResultBuilding;
import de.rinderle.softvis3d.domain.graph.ResultPlatform;
import de.rinderle.softvis3d.domain.tree.TreeNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class PostProcessorBean implements PostProcessor {

    private static final Logger LOGGER = LoggerFactory.getLogger(PostProcessorBean.class);

    private Map<Integer, ResultPlatform> resultGraphs;

    private Map<Integer, GrappaPoint> innerGraphTranslation;

    private int leafElements;

    @Override
    public int process(final LayoutViewType viewType, final Integer snapshotId,
            final Map<Integer, ResultPlatform> resultGraphs, final SnapshotTreeResult treeResult) {
        this.leafElements = 0;

        this.innerGraphTranslation = new HashMap<Integer, GrappaPoint>();
        this.resultGraphs = resultGraphs;

        this.addTranslationToLayer(treeResult.getTree(), new GrappaPoint(0, 0), viewType);

        return this.leafElements;
    }

    private void addTranslationToLayer(final TreeNode currentNode, final GrappaPoint posTranslation,
            final LayoutViewType layoutViewType) {

        LOGGER.debug("addTranslationToLayer" + currentNode.getId() + " " + posTranslation.toString());

        // inputGraphs --> Map<Integer, Graph>
        // Step 1 - search the graph for the source given
        final ResultPlatform platform = this.resultGraphs.get(currentNode.getId());

        // Step 2 - set translation for the graph itself (will be a layer later)
        final GrappaBox translatedBb = this.translatePlatform(platform, posTranslation);

        // Step 3 - for all leaves, just add the parent point3d changes
        this.translateLeaves(posTranslation, platform, translatedBb);

        // Step 4 - for all dirs, call this method (recursive) with the parent +
        // the self changes
        this.translateNodes(currentNode, platform, layoutViewType);
    }

    private void translateNodes(final TreeNode currentNode, final ResultPlatform graph,
            final LayoutViewType layoutViewType) {
        final List<TreeNode> children = currentNode.getChildrenNodes();

        for (final TreeNode child : children) {
            final GrappaPoint pos = this.innerGraphTranslation.get(child.getId());

            this.addTranslationToLayer(child, pos, layoutViewType);

            removeRepresentationNode(graph, layoutViewType, child);
        }
    }

    private void removeRepresentationNode(ResultPlatform graph, LayoutViewType layoutViewType, TreeNode child) {
        if (LayoutViewType.CITY.equals(layoutViewType)) {
            graph.removeNode(child.getId().toString());
        }
    }

    private void translateLeaves(final GrappaPoint posTranslation, final ResultPlatform graph,
            final GrappaBox translatedBb) {
        GrappaPoint pos;
        double nodeLocationX;
        double nodeLocationY;

        int height3d;

        for (final ResultBuilding leaf : graph.getNodes()) {
            pos = leaf.getPosition();

            this.innerGraphTranslation.put(leaf.getId(), pos);

            // set the position of the node
            nodeLocationX = posTranslation.getX() + pos.getX() - translatedBb.getWidth() / 2;
            nodeLocationY = posTranslation.getY() + pos.getY() + translatedBb.getHeight() / 2;
            pos.setLocation(nodeLocationX, nodeLocationY);

            this.leafElements = this.leafElements + 1;

            height3d = leaf.getHeight3d();

            for (final ResultArrow arrow : leaf.getArrows()) {
                translateArrow(posTranslation, translatedBb, height3d, arrow);
            }
        }

    }

    private void translateArrow(GrappaPoint posTranslation, GrappaBox translatedBb, int height3d, ResultArrow arrow) {
        final List<Point3d> result = new ArrayList<Point3d>();

        double arrowHeight = calc3dArrowPosition(height3d, arrow);

        for (Point3d point : arrow.getLinePoints()) {
            final Point3d temp = translateLinePoint(posTranslation, translatedBb, arrowHeight, point);
            result.add(temp);
        }

        arrow.setPoints(result);
    }

    private Point3d translateLinePoint(GrappaPoint posTranslation, GrappaBox translatedBb, double arrowHeight,
            Point3d point) {

        final double x = posTranslation.getX() + point.getX() - translatedBb.getWidth() / 2;
        final double y = arrowHeight;
        final double z = posTranslation.getY() + point.getZ() + translatedBb.getHeight() / 2;

        return new Point3d(x, y, z);
    }

    private double calc3dArrowPosition(int height3d, ResultArrow arrow) {
        double result = height3d;
        result = result + ResultPlatform.PLATFORM_HEIGHT;
        double diameter = (2 * 3.14) / arrow.getRadius();

        return result + diameter;
    }

    private GrappaBox translatePlatform(final ResultPlatform platform, final GrappaPoint posTranslation) {
        final GrappaBox bb = platform.getBoundingBox();
        final GrappaBox translatedBb =
                new GrappaBox(posTranslation.getX(), posTranslation.getY(), bb.getWidth(), bb.getHeight());
        platform.setBoundingBox(translatedBb);
        return translatedBb;
    }

}
