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
package de.rinderle.softvis3d;

import com.google.inject.Inject;
import de.rinderle.softvis3d.domain.LayoutViewType;
import de.rinderle.softvis3d.domain.SnapshotTreeResult;
import de.rinderle.softvis3d.domain.VisualizationRequest;
import de.rinderle.softvis3d.domain.graph.ResultPlatform;
import de.rinderle.softvis3d.layout.LayoutProcessor;
import de.rinderle.softvis3d.layout.dot.DotExecutorException;
import de.rinderle.softvis3d.postprocessing.PostProcessor;
import java.util.Map;
import org.apache.commons.lang.time.StopWatch;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class VisualizationProcessor {

  private static final Logger LOGGER = LoggerFactory.getLogger(VisualizationProcessor.class);

  @Inject
  private LayoutProcessor layoutProcessor;

  @Inject
  private PostProcessor calc;

  public Map<Integer, ResultPlatform> visualize(final Integer rootId, final VisualizationSettings settings,
                                                final VisualizationRequest requestDTO,
    final SnapshotTreeResult snapshotTreeResult) throws DotExecutorException {

    final StopWatch stopWatch = new StopWatch();
    stopWatch.start();

    final Map<Integer, ResultPlatform> resultGraphs =
      layoutProcessor.process(settings, requestDTO, snapshotTreeResult);

    LOGGER.info("Created " + resultGraphs.size() + " result graphs in " + stopWatch.getTime() + " ms");

    final int leavesCounter =
      this.calc.process(requestDTO.getViewType(), resultGraphs, snapshotTreeResult);

    stopWatch.stop();
    LOGGER.info("Calculation finished after " + stopWatch.getTime() + " ms with " + leavesCounter + " leaves");

    /**
     * Remove root layer in dependency view TODO: I don't know how to do this anywhere else.
     */
    if (requestDTO.getViewType().equals(LayoutViewType.DEPENDENCY)) {
      resultGraphs.remove(rootId);
    }

    return resultGraphs;
  }

}
