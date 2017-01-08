/**
 * SoftVis3D Sonar plugin
 * Copyright (C) 2016 Stefan Rinderle and Yvo Niedrich
 * stefan@rinderle.info / yvo.niedrich@gmail.com
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
package de.rinderle.softvis3d.webservice;

import com.google.inject.Inject;
import de.rinderle.softvis3d.base.domain.tree.RootTreeNode;
import de.rinderle.softvis3d.base.result.SoftVis3dJsonWriter;
import de.rinderle.softvis3d.base.result.TreeNodeJsonWriter;
import de.rinderle.softvis3d.dao.DaoService;
import de.rinderle.softvis3d.domain.VisualizationRequest;
import de.rinderle.softvis3d.preprocessing.PreProcessor;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sonar.api.server.ws.Request;
import org.sonar.api.server.ws.RequestHandler;
import org.sonar.api.server.ws.Response;

public class VisualizationWebserviceHandler extends AbstractWebserviceHandler implements RequestHandler {

  private static final Logger LOGGER = LoggerFactory.getLogger(VisualizationWebserviceHandler.class);

  @Inject
  private PreProcessor preProcessor;
  @Inject
  private DaoService daoService;
  @Inject
  private TreeNodeJsonWriter treeNodeJsonWriter;

  @Override
  public void handleRequest(final Request request, final Response response) {
    final String projectKey = request.param("projectKey");

    final String projectId = daoService.getProjectId(request.localConnector(), projectKey);

    final String metricsValue = request.param("metrics");
    String[] metrics = {};
    if (metricsValue != null && !StringUtils.isBlank(metricsValue)) {
      metrics = metricsValue.split(",");
    }

    final VisualizationRequest requestDTO = new VisualizationRequest(projectId, metrics);

    if (LOGGER.isInfoEnabled()) {
      LOGGER.info("VisualizationWebserviceHandler {}", requestDTO.toString());
    }

    final RootTreeNode snapshotTreeResult = preProcessor.process(request.localConnector(), requestDTO);

    this.writeResultsToResponse(response, snapshotTreeResult);
  }

  private void writeResultsToResponse(final Response response, final RootTreeNode snapshotTreeResult) {

    final SoftVis3dJsonWriter jsonWriter = new SoftVis3dJsonWriter(response.stream().output());

    this.treeNodeJsonWriter.transformRootTreeToJson(jsonWriter, snapshotTreeResult);
  }

}
