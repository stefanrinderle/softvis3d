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
import de.rinderle.softvis3d.VisualizationProcessor;
import de.rinderle.softvis3d.cache.LayoutCacheService;
import de.rinderle.softvis3d.domain.LayoutViewType;
import de.rinderle.softvis3d.domain.SnapshotStorageKey;
import de.rinderle.softvis3d.domain.SnapshotTreeResult;
import de.rinderle.softvis3d.domain.VisualizationRequest;
import de.rinderle.softvis3d.domain.graph.ResultPlatform;
import de.rinderle.softvis3d.layout.dot.DotExecutorException;
import de.rinderle.softvis3d.preprocessing.PreProcessor;
import de.rinderle.softvis3d.webservice.AbstractWebserviceHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sonar.api.config.Settings;
import org.sonar.api.database.DatabaseSession;
import org.sonar.api.server.ws.Request;
import org.sonar.api.server.ws.Response;
import org.sonar.api.utils.text.JsonWriter;

import java.util.Map;

public class VisualizationWebserviceHandlerBean extends AbstractWebserviceHandler implements VisualizationWebserviceHandler {

  private static final Logger LOGGER = LoggerFactory.getLogger(VisualizationWebserviceHandlerBean.class);

  private Settings settings;
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
  private TreeNodeJsonWriter treeNodeJsonWriter;

  @Override
  public void handleRequest(final Request request, final Response response) throws Exception {
    this.session.start();

    final Integer id = Integer.valueOf(request.param("snapshotId"));
    final Integer footprintMetricId = Integer.valueOf(request.param("footprintMetricId"));
    final Integer heightMetricId = Integer.valueOf(request.param("heightMetricId"));

    final LayoutViewType type = LayoutViewType.valueOfRequest(request.param("viewType"));
    final VisualizationRequest requestDTO = new VisualizationRequest(id, type, footprintMetricId, heightMetricId);

    LOGGER.info("VisualizationWebserviceHandler " + requestDTO.toString());

    SnapshotStorageKey key = new SnapshotStorageKey(requestDTO);

    final SnapshotTreeResult snapshotTreeResult = preProcessor.process(requestDTO, this.settings);

    boolean cacheEnabled = this.settings.getBoolean("cacheEnabled");
    final Map<Integer, ResultPlatform> visualizationResult;
    if (cacheEnabled && layoutCacheService.containsKey(key)) {
      LOGGER.info("Layout out of cache for " + key.getString());
      visualizationResult = layoutCacheService.getLayoutResult(key);
    } else {
      LOGGER.info("Create layout for " + key.getString());
      visualizationResult = createLayout(id, requestDTO, snapshotTreeResult);
      if (cacheEnabled) {
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

    this.treeNodeJsonWriter.transformTreeToJsonBla(jsonWriter, snapshotTreeResult.getTree());
    this.visualizationJsonWriter.transformResponseToJson(jsonWriter, visualizationResult);

    jsonWriter.endArray();

    jsonWriter.endObject();

    jsonWriter.close();
  }

  private Map<Integer, ResultPlatform> createLayout(final Integer id, final VisualizationRequest requestDTO,
    final SnapshotTreeResult snapshotTreeResult) throws DotExecutorException {
    logStartOfCalc(requestDTO);
    Map<Integer, ResultPlatform> result =
      visualizationProcessor.visualize(this.settings, requestDTO, snapshotTreeResult);

    /**
     * Remove root layer in dependency view TODO: I don't know how to do this anywhere else.
     */
    if (requestDTO.getViewType().equals(LayoutViewType.DEPENDENCY)) {
      result.remove(id);
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

  @Override
  public void setDatabaseSession(DatabaseSession session) {
    this.session = session;
  }
}
