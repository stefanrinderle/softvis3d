/*
 * SoftViz3d Sonar plugin
 * Copyright (C) 2013 Stefan Rinderle
 * stefan@rinderle.info
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02
 */
package de.rinderle.softviz3d.handler;

import com.google.inject.Inject;
import de.rinderle.softviz3d.cache.SnapshotCacheService;
import de.rinderle.softviz3d.domain.SnapshotStorageKey;
import de.rinderle.softviz3d.domain.VisualizationRequest;
import de.rinderle.softviz3d.domain.tree.TreeNode;
import de.rinderle.softviz3d.layout.calc.LayoutViewType;
import de.rinderle.softviz3d.preprocessing.PreProcessor;
import de.rinderle.softviz3d.sonar.SonarService;
import org.sonar.api.server.ws.Request;
import org.sonar.api.server.ws.Response;

public class SoftViz3dWebserviceInitializeHandlerImpl implements SoftViz3dWebserviceInitializeHandler {

  @Inject
  private SnapshotCacheService snapshotCacheService;
  @Inject
  private SonarService sonarService;
  @Inject
  private TreeNodeJsonWriter treeNodeJsonWriter;
  @Inject
  private PreProcessor preProcessor;

  @Override
  public void handle(final Request request, final Response response) {
    final Integer id = Integer.valueOf(request.param("snapshotId"));
    final Integer footprintMetricId = Integer.valueOf(request.param("footprintMetricId"));
    final Integer heightMetricId = Integer.valueOf(request.param("heightMetricId"));

    final LayoutViewType type = LayoutViewType.valueOfRequest(request.param("viewType"));
    final VisualizationRequest requestDTO = new VisualizationRequest(id, type, footprintMetricId, heightMetricId);

    final TreeNode tree = snapshotCacheService.getTreeStructure(new SnapshotStorageKey(requestDTO));

    this.treeNodeJsonWriter.transformTreeToJson(response, tree);
  }

}
