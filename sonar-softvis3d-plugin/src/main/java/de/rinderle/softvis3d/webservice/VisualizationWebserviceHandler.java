/**
 * SoftVis3D Sonar plugin
 * Copyright (C) 2016 Stefan Rinderle
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
package de.rinderle.softvis3d.webservice;

import com.google.inject.Inject;
import de.rinderle.softvis3d.SoftVis3DPlugin;
import de.rinderle.softvis3d.base.VisualizationAdditionalInfos;
import de.rinderle.softvis3d.base.VisualizationProcessor;
import de.rinderle.softvis3d.base.VisualizationSettings;
import de.rinderle.softvis3d.base.domain.MinMaxValue;
import de.rinderle.softvis3d.base.domain.SnapshotTreeResult;
import de.rinderle.softvis3d.base.domain.graph.ResultPlatform;
import de.rinderle.softvis3d.base.domain.tree.RootTreeNode;
import de.rinderle.softvis3d.base.layout.dot.DotExecutorException;
import de.rinderle.softvis3d.base.result.SoftVis3dJsonWriter;
import de.rinderle.softvis3d.base.result.TreeNodeJsonWriter;
import de.rinderle.softvis3d.base.result.VisualizationJsonWriter;
import de.rinderle.softvis3d.cache.LayoutCacheService;
import de.rinderle.softvis3d.dao.DaoService;
import de.rinderle.softvis3d.domain.SnapshotStorageKey;
import de.rinderle.softvis3d.domain.VisualizationRequest;
import de.rinderle.softvis3d.domain.sonar.ColorMetricType;
import de.rinderle.softvis3d.preprocessing.PreProcessor;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sonar.api.server.ws.Request;
import org.sonar.api.server.ws.RequestHandler;
import org.sonar.api.server.ws.Response;

public class VisualizationWebserviceHandler extends AbstractWebserviceHandler implements RequestHandler {

  private static final Logger LOGGER = LoggerFactory.getLogger(VisualizationWebserviceHandler.class);

  private VisualizationSettings visualizationSettings;

  @Inject
  private VisualizationProcessor visualizationProcessor;
  @Inject
  private LayoutCacheService layoutCacheService;
  @Inject
  private PreProcessor preProcessor;
  @Inject
  private DaoService daoService;

  @Inject
  private TreeNodeJsonWriter treeNodeJsonWriter;
  @Inject
  private VisualizationJsonWriter visualizationJsonWriter;


  @Override
  public void handleRequest(final Request request, final Response response) throws DotExecutorException {
    final String projectKey = request.param("projectKey");

    final String projectId = daoService.getProjectId(request.localConnector(), projectKey);

    final String footprintMetricKey = request.param("footprintMetricKey");
    final String heightMetricKey = request.param("heightMetricKey");

    final String colorMetricKey = request.param("colorMetricKey");
    final ColorMetricType colorMetricType = ColorMetricType.getColorMetricType(colorMetricKey);

    final VisualizationRequest requestDTO =
      new VisualizationRequest(projectId, footprintMetricKey, heightMetricKey, colorMetricType);

    LOGGER.info("VisualizationWebserviceHandler " + requestDTO.toString());

    final SnapshotStorageKey key = new SnapshotStorageKey(requestDTO);

    final SnapshotTreeResult snapshotTreeResult = preProcessor.process(request.localConnector(), requestDTO);

    final Map<String, ResultPlatform> visualizationResult;
    if (SoftVis3DPlugin.CACHE_ENABLED && layoutCacheService.containsKey(key)) {
      LOGGER.info("Layout out of cache for " + key.toString());
      visualizationResult = layoutCacheService.getLayoutResult(key);
    } else {
      LOGGER.info("Create layout for " + key.toString());
      visualizationResult = createLayout(requestDTO, snapshotTreeResult);
      if (SoftVis3DPlugin.CACHE_ENABLED) {
        layoutCacheService.save(key, visualizationResult);
      }
    }

    this.writeResultsToResponse(response, snapshotTreeResult, visualizationResult);
  }

  private void writeResultsToResponse(final Response response, final SnapshotTreeResult snapshotTreeResult,
    final Map<String, ResultPlatform> visualizationResult) {

    final SoftVis3dJsonWriter jsonWriter = new SoftVis3dJsonWriter(response.stream().output());

    jsonWriter.beginObject();
    jsonWriter.name("resultObject");

    jsonWriter.beginArray();

    this.treeNodeJsonWriter.transformRootTreeToJson(jsonWriter, snapshotTreeResult.getTree());
    this.visualizationJsonWriter.transformResponseToJson(jsonWriter, visualizationResult);

    jsonWriter.endArray();

    jsonWriter.endObject();

    jsonWriter.close();
  }

  private Map<String, ResultPlatform> createLayout(final VisualizationRequest requestDTO,
    final SnapshotTreeResult snapshotTreeResult) throws DotExecutorException {
    logStartOfCalc(requestDTO);

    return visualizationProcessor.visualize(this.visualizationSettings, snapshotTreeResult,
      createAdditionalInfos(snapshotTreeResult.getTree()));
  }

  private VisualizationAdditionalInfos createAdditionalInfos(RootTreeNode tree) {
    final MinMaxCalculator minMaxCalculator = new MinMaxCalculator(tree);

    final MinMaxValue minMaxMetricFootprint = minMaxCalculator.getMinMaxForFootprintMetric();
    final MinMaxValue minMaxMetricHeight = minMaxCalculator.getMinMaxForHeightMetric();
    final MinMaxValue minMaxMetricColor = minMaxCalculator.getMinMaxForColorMetric();

    return new VisualizationAdditionalInfos(minMaxMetricFootprint, minMaxMetricHeight, minMaxMetricColor);
  }

  private void logStartOfCalc(final VisualizationRequest visualizationRequest) {
    LOGGER.info("Start layout calculation for snapshot " + visualizationRequest.getRootSnapshotKey() + ", "
      + "metrics " + visualizationRequest.getHeightMetricKey() + " and "
      + visualizationRequest.getFootprintMetricKey());
  }

  public void setSettings(final VisualizationSettings settings) {
    this.visualizationSettings = settings;
  }

}
