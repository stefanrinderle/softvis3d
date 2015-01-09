/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d;

import com.google.inject.Inject;
import de.rinderle.softvis3d.domain.SnapshotTreeResult;
import de.rinderle.softvis3d.domain.VisualizationRequest;
import de.rinderle.softvis3d.domain.graph.ResultPlatform;
import de.rinderle.softvis3d.layout.LayoutProcessor;
import de.rinderle.softvis3d.layout.dot.DotExecutorException;
import de.rinderle.softvis3d.postprocessing.PostProcessor;
import de.rinderle.softvis3d.preprocessing.PreProcessor;
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
	public Map<Integer, ResultPlatform> visualize(final Settings settings,
			final VisualizationRequest requestDTO) throws DotExecutorException {

		final StopWatch stopWatch = new StopWatch();
		stopWatch.start();

		final SnapshotTreeResult snapshotTreeResult = preProcessor
				.process(requestDTO);

		LOGGER.info("Created tree structure after " + stopWatch.getTime());

		final Map<Integer, ResultPlatform> resultGraphs = layoutProcessor
				.process(settings, requestDTO, snapshotTreeResult);

		final int leavesCounter = this.calc.process(requestDTO.getViewType(),
				requestDTO.getRootSnapshotId(), resultGraphs,
				snapshotTreeResult);

		stopWatch.stop();
		LOGGER.info("Calculation finished after " + stopWatch.getTime()
				+ " with " + leavesCounter + " leaves");

		return resultGraphs;
	}

}
