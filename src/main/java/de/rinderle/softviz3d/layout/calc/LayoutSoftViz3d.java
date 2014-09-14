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
package de.rinderle.softviz3d.layout.calc;

import att.grappa.Graph;
import com.google.inject.Inject;
import de.rinderle.softviz3d.guice.BottomUpProcessorFactory;
import de.rinderle.softviz3d.guice.SnapshotVisitorFactory;
import de.rinderle.softviz3d.layout.calc.bottomup.Processor;
import de.rinderle.softviz3d.layout.calc.bottomup.SnapshotVisitor;
import de.rinderle.softviz3d.layout.calc.topdown.PositionCalculator;
import de.rinderle.softviz3d.layout.dot.DotExcecutorException;
import de.rinderle.softviz3d.sonar.SonarService;
import de.rinderle.softviz3d.sonar.SonarSnapshot;
import de.rinderle.softviz3d.tree.ResourceTreeService;
import org.apache.commons.lang.time.StopWatch;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sonar.api.config.Settings;

import java.util.List;
import java.util.Map;

public class LayoutSoftViz3d implements Layout {

    private static final Logger LOGGER = LoggerFactory
            .getLogger(LayoutSoftViz3d.class);

    @Inject
    private ResourceTreeService resourceTreeService;
    @Inject
    private SonarService sonarService;
    @Inject
    private SnapshotVisitorFactory visitorFactory;
    @Inject
    private BottomUpProcessorFactory processorFactory;
    @Inject
    private PositionCalculator calc;

    @Override
    public Map<Integer, Graph> startLayout(Settings settings, Integer snapshotId,
            Integer footprintMetricId, Integer heightMetricId) throws DotExcecutorException {

        StopWatch stopWatch = new StopWatch();
        stopWatch.start();

        resourceTreeService.createTreeStructrue(snapshotId);

        LOGGER.info("Created tree structure after " + stopWatch.getTime());

        SonarSnapshot snapshot = sonarService.getSnapshotById(snapshotId, footprintMetricId, heightMetricId, 0);

        Map<Integer, Graph> resultGraphs = startBottomUpCalculation(snapshot, settings, footprintMetricId, heightMetricId);

        int leavesCounter = calc.calculate(snapshot.getId(), resultGraphs);

        stopWatch.stop();
        LOGGER.info("Calculation finished after " + stopWatch.getTime() + " with "
                + leavesCounter + " leaves");

        return resultGraphs;
    }

    private Map<Integer, Graph> startBottomUpCalculation(SonarSnapshot snapshot,
            Settings settings, Integer footprintMetricId, Integer heightMetricId)
            throws DotExcecutorException {

        List<Double> minMaxValues = sonarService.getMinMaxMetricValuesByRootSnapshotId(
                snapshot.getId(), footprintMetricId, heightMetricId);

        SnapshotVisitor visitor = visitorFactory.create(settings, minMaxValues);
        Processor processor = processorFactory.create(footprintMetricId, heightMetricId);

        processor.accept(visitor, snapshot, 0);

        return visitor.getResultingGraphList();
    }

}
