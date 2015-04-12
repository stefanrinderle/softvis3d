/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.webservice.tree;

import com.google.inject.Inject;
import de.rinderle.softvis3d.cache.SnapshotCacheService;
import de.rinderle.softvis3d.domain.LayoutViewType;
import de.rinderle.softvis3d.domain.SnapshotStorageKey;
import de.rinderle.softvis3d.domain.SnapshotTreeResult;
import de.rinderle.softvis3d.domain.VisualizationRequest;
import de.rinderle.softvis3d.webservice.AbstractWebserviceHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sonar.api.server.ws.Request;
import org.sonar.api.server.ws.Response;

public class TreeWebserviceHandlerBean extends AbstractWebserviceHandler implements TreeWebserviceHandler {

    private static final Logger LOGGER = LoggerFactory.getLogger(TreeWebserviceHandlerBean.class);

    @Inject
    private SnapshotCacheService snapshotCacheService;
    @Inject
    private TreeNodeJsonWriter treeNodeJsonWriter;

    @Override
    public void handleRequest(final Request request, final Response response) throws Exception {
        final Integer id = Integer.valueOf(request.param("snapshotId"));
        final Integer footprintMetricId = Integer.valueOf(request.param("footprintMetricId"));
        final Integer heightMetricId = Integer.valueOf(request.param("heightMetricId"));

        final LayoutViewType type = LayoutViewType.valueOfRequest(request.param("viewType"));

        final VisualizationRequest requestDTO = new VisualizationRequest(id, type, footprintMetricId, heightMetricId);

        LOGGER.info("TreeWebserviceHandler " + requestDTO.toString());

        final SnapshotTreeResult result =
            snapshotCacheService.getSnapshotTreeResult(new SnapshotStorageKey(requestDTO));

        this.treeNodeJsonWriter.transformTreeToJson(response, result.getTree());
    }

}
