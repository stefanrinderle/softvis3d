/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
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
package de.rinderle.softvis3d.webservice.visualization;

import com.google.inject.Inject;
import de.rinderle.softvis3d.SoftVis3DPlugin;
import de.rinderle.softvis3d.VisualizationAdditionalInfos;
import de.rinderle.softvis3d.VisualizationProcessor;
import de.rinderle.softvis3d.VisualizationSettings;
import de.rinderle.softvis3d.cache.LayoutCacheService;
import de.rinderle.softvis3d.dao.DaoService;
import de.rinderle.softvis3d.domain.LayoutViewType;
import de.rinderle.softvis3d.domain.MinMaxValue;
import de.rinderle.softvis3d.domain.SnapshotStorageKey;
import de.rinderle.softvis3d.domain.SnapshotTreeResult;
import de.rinderle.softvis3d.domain.VisualizationRequest;
import de.rinderle.softvis3d.domain.graph.ResultPlatform;
import de.rinderle.softvis3d.domain.sonar.ScmInfoType;
import de.rinderle.softvis3d.layout.dot.DotExecutorException;
import de.rinderle.softvis3d.preprocessing.PreProcessor;
import de.rinderle.softvis3d.webservice.AbstractWebserviceHandler;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sonar.api.database.DatabaseSession;
import org.sonar.api.server.ws.Request;
import org.sonar.api.server.ws.RequestHandler;
import org.sonar.api.server.ws.Response;
import org.sonar.api.utils.text.JsonWriter;

public class VisualizationWebserviceHandler extends AbstractWebserviceHandler implements RequestHandler {

  private static final Logger LOGGER = LoggerFactory.getLogger(VisualizationWebserviceHandler.class);

  private VisualizationSettings visualizationSettings;
  private DatabaseSession session;

  @Inject
  private VisualizationProcessor visualizationProcessor;
  @Inject
  private VisualizationJsonWriter visualizationJsonWriter;
  @Inject
  private LayoutCacheService layoutCacheService;
  @Inject
  private PreProcessor preProcessor;
  @Inject
  private DaoService daoService;

  @Inject
  private TreeNodeJsonWriter treeNodeJsonWriter;

  @Override
  public void handleRequest(final Request request, final Response response) throws Exception {
    this.session.start();

    final Integer id = Integer.valueOf(request.param("snapshotId"));
    final Integer footprintMetricId = Integer.valueOf(request.param("footprintMetricId"));
    final Integer heightMetricId = Integer.valueOf(request.param("heightMetricId"));
    final LayoutViewType layoutViewType = LayoutViewType.valueOfRequest(request.param("viewType"));

    final ScmInfoType scmInfoType = ScmInfoType.valueOf(request.param("scmMetricType"));
    final VisualizationRequest requestDTO =
      new VisualizationRequest(id, layoutViewType, footprintMetricId, heightMetricId, scmInfoType);

    LOGGER.info("VisualizationWebserviceHandler " + requestDTO.toString());

    final SnapshotStorageKey key = new SnapshotStorageKey(requestDTO);

    final SnapshotTreeResult snapshotTreeResult = preProcessor.process(requestDTO);

    final Map<Integer, ResultPlatform> visualizationResult;
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

    this.session.commit();
  }

  private void writeResultsToResponse(final Response response, final SnapshotTreeResult snapshotTreeResult,
    final Map<Integer, ResultPlatform> visualizationResult) {

    final JsonWriter jsonWriter = response.newJsonWriter();

    jsonWriter.beginObject();
    jsonWriter.name("resultObject");

    jsonWriter.beginArray();

    this.treeNodeJsonWriter.transformRootTreeToJson(jsonWriter, snapshotTreeResult.getTree());
    this.visualizationJsonWriter.transformResponseToJson(jsonWriter, visualizationResult);

    jsonWriter.endArray();

    jsonWriter.endObject();

    jsonWriter.close();
  }

  private Map<Integer, ResultPlatform> createLayout(final VisualizationRequest requestDTO,
    final SnapshotTreeResult snapshotTreeResult) throws DotExecutorException {
    logStartOfCalc(requestDTO);

    final Map<Integer, ResultPlatform> result = visualizationProcessor.visualize(requestDTO.getViewType(), this.visualizationSettings, snapshotTreeResult,
      createAdditionalInfos(requestDTO));

    /**
     * Remove root layer in dependency view TODO: I don't know how to do this anywhere else.
     */
    if (requestDTO.getViewType().equals(LayoutViewType.DEPENDENCY)) {
      result.remove(requestDTO.getRootSnapshotId());
    }

    return result;
  }

  private VisualizationAdditionalInfos createAdditionalInfos(VisualizationRequest requestDTO) {
    final MinMaxValue minMaxMetricFootprint = daoService.getMinMaxMetricValuesByRootSnapshotId(requestDTO.getRootSnapshotId(),
      requestDTO.getFootprintMetricId());
    final MinMaxValue minMaxMetricHeight = daoService.getMinMaxMetricValuesByRootSnapshotId(requestDTO.getRootSnapshotId(),
      requestDTO.getHeightMetricId());

    int dependenciesCount = daoService.getDependencies(requestDTO.getRootSnapshotId()).size();

    // TODO
    final MinMaxValue minMaxMetricColor = daoService.getMaxScmInfo(requestDTO);

    return new VisualizationAdditionalInfos(minMaxMetricFootprint, minMaxMetricHeight, minMaxMetricColor, dependenciesCount);
  }

  private void logStartOfCalc(final VisualizationRequest visualizationRequest) {
    LOGGER.info("Start layout calculation for snapshot " + visualizationRequest.getRootSnapshotId() + ", "
      + "metrics " + visualizationRequest.getHeightMetricId() + " and "
      + visualizationRequest.getFootprintMetricId());
  }

  public void setSettings(final VisualizationSettings settings) {
    this.visualizationSettings = settings;
  }

  public void setDatabaseSession(final DatabaseSession session) {
    this.session = session;
  }
}
