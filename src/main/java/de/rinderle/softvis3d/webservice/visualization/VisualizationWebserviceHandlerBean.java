/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.webservice.visualization;

import com.google.inject.Inject;
import de.rinderle.softvis3d.SoftVis3DPlugin;
import de.rinderle.softvis3d.VisualizationProcessor;
import de.rinderle.softvis3d.cache.LayoutCacheService;
import de.rinderle.softvis3d.domain.LayoutViewType;
import de.rinderle.softvis3d.domain.SnapshotStorageKey;
import de.rinderle.softvis3d.domain.VisualizationRequest;
import de.rinderle.softvis3d.domain.graph.ResultPlatform;
import de.rinderle.softvis3d.layout.dot.DotExecutorException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sonar.api.config.Settings;
import org.sonar.api.server.ws.Request;
import org.sonar.api.server.ws.Response;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class VisualizationWebserviceHandlerBean implements VisualizationWebserviceHandler {

    private static final Logger LOGGER = LoggerFactory.getLogger(VisualizationWebserviceHandlerBean.class);

    private Settings settings;

    @Inject
    private VisualizationProcessor visualizationProcessor;
    @Inject
    private VisualizationJsonWriter visualizationJsonWriter;
    @Inject
    private LayoutCacheService layoutCacheService;

    @Override
    public void handle(final Request request, final Response response) {
        final Integer id = Integer.valueOf(request.param("snapshotId"));
        final Integer footprintMetricId = Integer.valueOf(request.param("footprintMetricId"));
        final Integer heightMetricId = Integer.valueOf(request.param("heightMetricId"));

        final LayoutViewType type = LayoutViewType.valueOfRequest(request.param("viewType"));
        final VisualizationRequest requestDTO = new VisualizationRequest(id, type, footprintMetricId, heightMetricId);

        SnapshotStorageKey key = new SnapshotStorageKey(requestDTO);

        final Map<Integer, ResultPlatform> result;
        if (SoftVis3DPlugin.CACHE_ENABLED && layoutCacheService.containsKey(key)) {
            LOGGER.info("Layout out of cache for " + key.getString());
            result = layoutCacheService.getLayoutResult(key);
        } else {
            LOGGER.info("Create layout for " + key.getString());
            result = createLayout(id, requestDTO);
            if (SoftVis3DPlugin.CACHE_ENABLED) {
                layoutCacheService.save(key, result);
            }
        }

        this.visualizationJsonWriter.transformResponseToJson(response, result);
    }

    private Map<Integer, ResultPlatform> createLayout(Integer id, VisualizationRequest requestDTO) {
        Map<Integer, ResultPlatform> result = new ConcurrentHashMap<Integer, ResultPlatform>();
        logStartOfCalc(requestDTO);
        try {
            result = visualizationProcessor.visualize(this.settings, requestDTO);

            LOGGER.info("Finished layout");

            /**
             * Remove root layer in dependency view TODO: I don't know how to do this anywhere else.
             */
            if (requestDTO.getViewType().equals(LayoutViewType.DEPENDENCY)) {
                result.remove(id);
            }

        } catch (DotExecutorException e) {
            LOGGER.error("error on dot execution.", e);
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
        }
        return result;
    }

    private void logStartOfCalc(VisualizationRequest visualizationRequest) {
        LOGGER.info("Start layout calculation for snapshot " + visualizationRequest.getRootSnapshotId() + ", "
                + "metrics " + visualizationRequest.getHeightMetricId() + " and "
                + visualizationRequest.getFootprintMetricId());
    }

    @Override
    public void setSettings(Settings settings) {
        this.settings = settings;
    }
}
