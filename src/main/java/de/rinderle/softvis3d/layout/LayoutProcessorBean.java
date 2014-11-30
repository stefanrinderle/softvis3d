/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.layout;

import com.google.inject.Inject;
import de.rinderle.softvis3d.dao.DaoService;
import de.rinderle.softvis3d.domain.MinMaxValue;
import de.rinderle.softvis3d.domain.SnapshotTreeResult;
import de.rinderle.softvis3d.domain.VisualizationRequest;
import de.rinderle.softvis3d.domain.graph.ResultPlatform;
import de.rinderle.softvis3d.guice.SnapshotVisitorFactory;
import de.rinderle.softvis3d.layout.bottomUp.BottomUpLayout;
import de.rinderle.softvis3d.layout.bottomUp.SnapshotVisitor;
import de.rinderle.softvis3d.layout.dot.DotExecutorException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sonar.api.config.Settings;

import java.util.Map;

public class LayoutProcessorBean implements LayoutProcessor {

  @Inject
  private DaoService daoService;
  @Inject
  private SnapshotVisitorFactory visitorFactory;
  @Inject
  private BottomUpLayout bottomUpLayout;

  private static final Logger LOGGER = LoggerFactory
    .getLogger(LayoutProcessorBean.class);

  @Override
  public Map<Integer, ResultPlatform> process(Settings settings, VisualizationRequest requestDTO,
    SnapshotTreeResult snapshotTreeResult)
    throws DotExecutorException {
    final MinMaxValue minMaxFootprintValues = this.daoService.getMinMaxMetricValuesByRootSnapshotId(
      requestDTO.getRootSnapshotId(), requestDTO.getFootprintMetricId());
    final MinMaxValue minMaxHeightValues = this.daoService.getMinMaxMetricValuesByRootSnapshotId(
      requestDTO.getRootSnapshotId(), requestDTO.getHeightMetricId());

    LOGGER.info("minMaxValues for " + requestDTO.getRootSnapshotId() + " : " + minMaxFootprintValues.toString() + " "
      + minMaxHeightValues.toString());

    final MinMaxValue minMaxEdgeCounter = new MinMaxValue(1.0, (double) snapshotTreeResult.getMaxEdgeCounter());

    final SnapshotVisitor visitor = this.visitorFactory.create(settings, requestDTO.getViewType(),
      minMaxFootprintValues, minMaxHeightValues, minMaxEdgeCounter);

    this.bottomUpLayout.accept(visitor, snapshotTreeResult);

    return visitor.getResultingGraphList();
  }
}
