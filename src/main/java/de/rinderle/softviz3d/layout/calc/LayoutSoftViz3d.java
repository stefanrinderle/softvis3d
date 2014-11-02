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
import de.rinderle.softviz3d.guice.SnapshotVisitorFactory;
import de.rinderle.softviz3d.layout.calc.bottomup.BottomUpProcessor;
import de.rinderle.softviz3d.layout.calc.bottomup.SnapshotVisitor;
import de.rinderle.softviz3d.layout.calc.topdown.PositionCalculator;
import de.rinderle.softviz3d.layout.dot.DotExcecutorException;
import de.rinderle.softviz3d.sonar.DependencyDao;
import de.rinderle.softviz3d.sonar.MinMaxValueDao;
import de.rinderle.softviz3d.sonar.SonarDependency;
import de.rinderle.softviz3d.sonar.SonarService;
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
  private DependencyExpander dependencyExpander;
  @Inject
  private SonarService sonarService;
  @Inject
  private DependencyDao dependencyDao;
  @Inject
  private SnapshotVisitorFactory visitorFactory;
  @Inject
  private BottomUpProcessor processor;
  @Inject
  private PositionCalculator calc;

  @Override
  public Map<Integer, Graph> startLayout(final Settings settings, final Integer snapshotId,
    final Integer footprintMetricId, final Integer heightMetricId, final LayoutViewType viewType)
    throws DotExcecutorException {

    final StopWatch stopWatch = new StopWatch();
    stopWatch.start();

    // TODO: do in one step
    int maxEdgeCounter = 0;
    this.resourceTreeService.createTreeStructure(viewType, snapshotId, footprintMetricId, heightMetricId);
    if (LayoutViewType.DEPENDENCY.equals(viewType)) {
      final List<SonarDependency> dependencies = this.dependencyDao.getDependencies(snapshotId);
      maxEdgeCounter = this.dependencyExpander.execute(snapshotId, dependencies);
    }

    LOGGER.info("Created tree structure after " + stopWatch.getTime());

    final Map<Integer, Graph> resultGraphs = this.startBottomUpCalculation(snapshotId, settings, footprintMetricId, heightMetricId, viewType, maxEdgeCounter);

    final int leavesCounter = this.calc.calculate(viewType, snapshotId, resultGraphs);

    stopWatch.stop();
    LOGGER.info("Calculation finished after " + stopWatch.getTime() + " with "
      + leavesCounter + " leaves");

    return resultGraphs;
  }

  private Map<Integer, Graph> startBottomUpCalculation(final Integer snapshotId,
    final Settings settings, final Integer footprintMetricId, final Integer heightMetricId,
    final LayoutViewType viewType, final int maxEdgeCounter)
    throws DotExcecutorException {

    final List<Double> minMaxValues = this.sonarService.getMinMaxMetricValuesByRootSnapshotId(
      snapshotId, footprintMetricId, heightMetricId);

    final MinMaxValueDao minMaxEdgeCounter = new MinMaxValueDao(1.0, Double.valueOf(maxEdgeCounter));
    final SnapshotVisitor visitor = this.visitorFactory.create(settings, minMaxValues, viewType, minMaxEdgeCounter);

    this.processor.accept(viewType, visitor, snapshotId, snapshotId);

    return visitor.getResultingGraphList();
  }

}
