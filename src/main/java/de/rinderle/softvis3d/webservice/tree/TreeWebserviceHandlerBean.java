/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
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
import org.sonar.api.server.ws.Request;
import org.sonar.api.server.ws.Response;

public class TreeWebserviceHandlerBean implements TreeWebserviceHandler {

  @Inject
  private SnapshotCacheService snapshotCacheService;
  @Inject
  private TreeNodeJsonWriter treeNodeJsonWriter;

  @Override
  public void handle(final Request request, final Response response) {
    final Integer id = Integer.valueOf(request.param("snapshotId"));
    final Integer footprintMetricId = Integer.valueOf(request.param("footprintMetricId"));
    final Integer heightMetricId = Integer.valueOf(request.param("heightMetricId"));

    final LayoutViewType type = LayoutViewType.valueOfRequest(request.param("viewType"));
    final VisualizationRequest requestDTO = new VisualizationRequest(id, type, footprintMetricId, heightMetricId);

    final SnapshotTreeResult result = snapshotCacheService.getSnapshotTreeResult(new SnapshotStorageKey(requestDTO));

    this.treeNodeJsonWriter.transformTreeToJson(response, result.getTree());
  }

}
