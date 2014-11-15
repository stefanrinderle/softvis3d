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
package de.rinderle.softviz3d;

import att.grappa.Graph;
import com.google.inject.Inject;
import de.rinderle.softviz3d.domain.SnapshotTreeResult;
import de.rinderle.softviz3d.domain.VisualizationRequest;
import de.rinderle.softviz3d.layout.LayoutProcessor;
import de.rinderle.softviz3d.layout.dot.DotExecutorException;
import de.rinderle.softviz3d.postprocessing.PostProcessor;
import de.rinderle.softviz3d.preprocessing.PreProcessor;
import org.apache.commons.lang.time.StopWatch;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sonar.api.config.Settings;

import java.util.Map;

public class VisualizationProcessorBean implements VisualizationProcessor {

  private static final Logger LOGGER = LoggerFactory
    .getLogger(VisualizationProcessorBean.class);

  @Inject
  private PreProcessor preProcessor;
  @Inject
  private LayoutProcessor layoutProcessor;

  @Inject
  private PostProcessor calc;

  @Override
  public Map<Integer, Graph> visualize(final Settings settings, final VisualizationRequest requestDTO)
    throws DotExecutorException {

    final StopWatch stopWatch = new StopWatch();
    stopWatch.start();

    final SnapshotTreeResult snapshotTreeResult = preProcessor.process(requestDTO);

    LOGGER.info("Created tree structure after " + stopWatch.getTime());

    final Map<Integer, Graph> resultGraphs = layoutProcessor.process(settings, requestDTO, snapshotTreeResult);

    final int leavesCounter = this.calc.process(requestDTO.getViewType(), requestDTO.getRootSnapshotId(),
      resultGraphs, snapshotTreeResult);

    stopWatch.stop();
    LOGGER.info("Calculation finished after " + stopWatch.getTime() + " with "
      + leavesCounter + " leaves");

    return resultGraphs;
  }

}
