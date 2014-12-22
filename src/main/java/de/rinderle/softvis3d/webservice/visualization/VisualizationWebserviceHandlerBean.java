/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.webservice.visualization;


import com.google.inject.Inject;
import de.rinderle.softvis3d.VisualizationProcessor;
import de.rinderle.softvis3d.domain.LayoutViewType;
import de.rinderle.softvis3d.domain.VisualizationRequest;
import de.rinderle.softvis3d.domain.graph.ResultPlatform;
import de.rinderle.softvis3d.layout.dot.DotExecutorException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sonar.api.config.Settings;
import org.sonar.api.server.ws.Request;
import org.sonar.api.server.ws.Response;

import java.util.Map;

public class VisualizationWebserviceHandlerBean implements VisualizationWebserviceHandler {

  private static final Logger LOGGER = LoggerFactory
          .getLogger(VisualizationWebserviceHandlerBean.class);

  private Settings settings;

  @Inject
  private VisualizationProcessor visualizationProcessor;
  @Inject
  private VisualizationJsonWriter visualizationJsonWriter;

  @Override
  public void handle(final Request request, final Response response) {
    final Integer id = Integer.valueOf(request.param("snapshotId"));
    final Integer footprintMetricId = Integer.valueOf(request.param("footprintMetricId"));
    final Integer heightMetricId = Integer.valueOf(request.param("heightMetricId"));

    final LayoutViewType type = LayoutViewType.valueOfRequest(request.param("viewType"));
    final VisualizationRequest requestDTO = new VisualizationRequest(id, type, footprintMetricId, heightMetricId);

    try {
      Map<Integer, ResultPlatform> result = createLayoutBySnapshotId(requestDTO);

      this.visualizationJsonWriter.transformResponseToJson(response, result);
    } catch (DotExecutorException e) {
      e.printStackTrace();
    }
  }

  private Map<Integer, ResultPlatform> createLayoutBySnapshotId(final VisualizationRequest visualizationRequest) throws DotExecutorException {
    logStartOfCalc(visualizationRequest);
    return visualizationProcessor.visualize(this.settings, visualizationRequest);
  }

  private void logStartOfCalc(VisualizationRequest visualizationRequest) {
    LOGGER.info("Start layout calculation for snapshot "
            + visualizationRequest.getRootSnapshotId() + ", " + "metrics " + visualizationRequest.getHeightMetricId()
            + " and " + visualizationRequest.getFootprintMetricId());
  }

  @Override
  public void setSettings(Settings settings) {
    this.settings = settings;
  }
}
