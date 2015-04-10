/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.layout.bottomUp;

import att.grappa.Graph;
import att.grappa.GrappaBox;
import att.grappa.Node;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;
import de.rinderle.softvis3d.dao.DaoService;
import de.rinderle.softvis3d.domain.LayoutViewType;
import de.rinderle.softvis3d.domain.MinMaxValue;
import de.rinderle.softvis3d.domain.SoftVis3DConstants;
import de.rinderle.softvis3d.domain.VisualizationRequest;
import de.rinderle.softvis3d.domain.graph.ResultPlatform;
import de.rinderle.softvis3d.domain.layout.GrappaTransformer;
import de.rinderle.softvis3d.domain.layout.LayeredLayoutElement;
import de.rinderle.softvis3d.domain.tree.*;
import de.rinderle.softvis3d.layout.dot.DotExecutor;
import de.rinderle.softvis3d.layout.dot.DotExecutorException;
import de.rinderle.softvis3d.layout.format.LayerFormatter;
import de.rinderle.softvis3d.layout.helper.HexaColor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sonar.api.config.Settings;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class SnapshotVisitorBean implements SnapshotVisitor {

    private static final Logger LOGGER = LoggerFactory.getLogger(SnapshotVisitorBean.class);

    // getting injected - see constructor
    private final DotExecutor dotExecutor;
    private final LayerFormatter formatter;
    private final GrappaTransformer transformer;

    private final Settings settings;

    private final MinMaxValue minMaxMetricFootprint;
    private final MinMaxValue minMaxMetricHeight;
    private final int dependenciesCount;

    private final Map<Integer, ResultPlatform> resultingGraphList = new ConcurrentHashMap<Integer, ResultPlatform>();

    private final LayoutViewType viewType;
    private final int maxScmInfo;

    @Inject
    public SnapshotVisitorBean(final LayerFormatter formatter, final DotExecutor dotExecutor,
            final GrappaTransformer transformer, final DaoService daoService, @Assisted final Settings settings,
            @Assisted final VisualizationRequest requestDTO) {
        this.settings = settings;

        this.dotExecutor = dotExecutor;
        this.formatter = formatter;
        this.transformer = transformer;

        this.minMaxMetricFootprint =
                daoService.getMinMaxMetricValuesByRootSnapshotId(requestDTO.getRootSnapshotId(),
                        requestDTO.getFootprintMetricId());
        this.minMaxMetricHeight =
                daoService.getMinMaxMetricValuesByRootSnapshotId(requestDTO.getRootSnapshotId(),
                        requestDTO.getHeightMetricId());

        this.dependenciesCount = daoService.getDependencies(requestDTO.getRootSnapshotId()).size();

        this.maxScmInfo = daoService.getMaxScmInfo(requestDTO.getRootSnapshotId());
        LOGGER.info("minMaxValues for " + requestDTO.getRootSnapshotId() + " : " + minMaxMetricFootprint.toString()
                + " " + minMaxMetricHeight.toString() + " Dependencies: " + this.dependenciesCount);

        this.viewType = requestDTO.getViewType();
    }

    @Override
    public Map<Integer, ResultPlatform> getResultingGraphList() {
        return this.resultingGraphList;
    }

    @Override
    public LayeredLayoutElement visitNode(final TreeNode node, final List<LayeredLayoutElement> elements)
        throws DotExecutorException {

        LOGGER.debug("LayoutVisitor.visitNode " + node.getId() + " " + node.getName());

        // create layout graph
        final Graph inputGraph = createGrappaInputGraph(node, elements);

        // run dot layout for this layer
        final Graph outputGraph = this.dotExecutor.run(inputGraph, this.settings, this.viewType);

        final ResultPlatform resultPlatform = new ResultPlatform(outputGraph);

        // adjust graph
        this.formatter.format(resultPlatform, node.getDepth(), this.viewType);

        this.resultingGraphList.put(node.getId(), resultPlatform);

        // adjusted graph has a bounding box !
        final GrappaBox bb = resultPlatform.getBoundingBox();

        /**
         * The dot output of the bb is given in DPI. The actual width and height of the representing element has to be
         * scaled back to normal
         */
        final Double width = bb.getWidth() / SoftVis3DConstants.DPI_DOT_SCALE;
        final Double height = bb.getHeight() / SoftVis3DConstants.DPI_DOT_SCALE;

        final double platformHeight = SoftVis3DConstants.PLATFORM_DEFAULT_HEIGHT;

        final HexaColor platformColor = this.formatter.getPlatformBaseColor(node.getDepth());

        /**
         * this will be the representation node of this layer in the upper layer. Currently, the "building" is the
         * deleted if the city view is enabled.
         */
        return LayeredLayoutElement.createLayeredLayoutElement(node, width, height, platformHeight, platformColor);
    }

    private Graph createGrappaInputGraph(TreeNode node, List<LayeredLayoutElement> elements) {
        final Graph inputGraph = new Graph(node.getId().toString());

        for (final LayeredLayoutElement element : elements) {
            final Node elementNode = this.transformer.transformToGrappaNode(inputGraph, element);
            inputGraph.addNode(elementNode);
        }

        for (final LayeredLayoutElement element : elements) {
            for (final Edge edge : element.getEdges().values()) {
                inputGraph.addEdge(this.transformer.transformToGrappaEdge(inputGraph, edge));
            }
        }
        return inputGraph;
    }

    @Override
    public LayeredLayoutElement visitFile(final TreeNode leaf) {
        LOGGER.debug("Leaf : " + leaf.getId() + " " + leaf.getName());

        boolean isDependencyNode =
                TreeNodeType.DEPENDENCY_GENERATED.equals(leaf.getType())
                        && LayoutViewType.DEPENDENCY.equals(this.viewType);

        double sideLength;
        double buildingHeight;

        final HexaColor color;

        if (isDependencyNode) {
            DependencyTreeNode leafNode = (DependencyTreeNode) leaf;
            final MinMaxValue minMaxDependencies =
                    new MinMaxValue(0.0, Integer.valueOf(dependenciesCount).doubleValue());
            sideLength =
                    this.formatter.calcSideLength(Integer.valueOf(leafNode.getCounter()).doubleValue(),
                            minMaxDependencies);

            buildingHeight = SoftVis3DConstants.LAYER_HEIGHT;

            // not used, will be overriden somewhere
            color = new HexaColor(255, 255, 255);
        } else {
            ValueTreeNode leafNode = (ValueTreeNode) leaf;
            sideLength = this.formatter.calcSideLength(leafNode.getFootprintMetricValue(), this.minMaxMetricFootprint);

            buildingHeight =
                    this.formatter.calcBuildingHeight(leafNode.getHeightMetricValue(), this.minMaxMetricHeight);
            /**
             * building height is in percent with min size. multiplier to get higher buildings in the view.
             */
            buildingHeight = buildingHeight * SoftVis3DConstants.BUILDING_HEIGHT_MULTIPLIER;
            buildingHeight = Math.round(buildingHeight);

            color = this.formatter.getScmColorInfo(leafNode, this.maxScmInfo);
        }

        sideLength = sideLength / SoftVis3DConstants.DPI_DOT_SCALE;

        return LayeredLayoutElement.createLayeredLayoutElement(leaf, sideLength, sideLength, buildingHeight, color);
    }

}
