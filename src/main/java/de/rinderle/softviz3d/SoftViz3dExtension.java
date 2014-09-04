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

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sonar.api.ServerExtension;
import org.sonar.api.config.Settings;
import org.sonar.api.database.DatabaseSession;

import att.grappa.Graph;

import com.google.inject.Guice;
import com.google.inject.Injector;

import de.rinderle.softviz3d.guice.LayoutVisitorFactory;
import de.rinderle.softviz3d.guice.SoftViz3dModule;
import de.rinderle.softviz3d.layout.Layout;
import de.rinderle.softviz3d.layout.calc.LayoutVisitor;
import de.rinderle.softviz3d.layout.dot.DotExcecutorException;
import de.rinderle.softviz3d.sonar.SonarService;
import de.rinderle.softviz3d.sonar.SonarDao;
import de.rinderle.softviz3d.sonar.SonarMetric;
import de.rinderle.softviz3d.sonar.SonarSnapshot;
import de.rinderle.softviz3d.sonar.SonarSnapshotWrapper;

public class SoftViz3dExtension implements ServerExtension {

    private static final Logger LOGGER = LoggerFactory
            .getLogger(SoftViz3dExtension.class);

    private Settings settings;

    private SonarDao sonarDao;
    
    private SonarService sonarService;

    private Injector softVizInjector;

    public SoftViz3dExtension(DatabaseSession session, Settings settings) {
        this.settings = settings;

        /*
         * Guice.createInjector() takes your Modules, and returns a new Injector
         * instance. Most applications will call this method exactly once, in
         * their main() method.
         */
        softVizInjector = Guice.createInjector(new SoftViz3dModule());

        this.sonarDao = softVizInjector.getInstance(SonarDao.class);
        this.sonarService = softVizInjector.getInstance(SonarService.class);
        this.sonarDao.setDatabaseSession(session);
    }

    public List<Integer> getMetricsForSnapshot(Integer snapshotId) {
        LOGGER.info("getMetricsForSnapshot " + snapshotId);

        return sonarService.getDefinedMetricsForSnapshot(snapshotId);
    }

    public Integer getMetric1FromSettings() {
        return sonarService.getMetric1FromSettings(settings);
    }

    /**
     * used direkt hintereinander.
     */
    public Integer getMetric2FromSettings() {
        return sonarService.getMetric2FromSettings(settings);
    }

    public Map<Integer, Graph> createLayoutBySnapshotId(Integer snapshotId,
            String metricString1, String metricString2) throws DotExcecutorException {
        LOGGER.info("Startup SoftViz3d plugin with snapshot " + snapshotId);

        Integer metricId1 = Integer.valueOf(metricString1);
        Integer metricId2 = Integer.valueOf(metricString2);
        
        List<Double> minMaxValues = sonarService.getMinMaxMetricValuesByRootSnapshotId(
                snapshotId, metricId1, metricId2);

        SonarSnapshot snapshot = sonarService.getSnapshotById(snapshotId, metricId1,
                metricId2);
        
        SonarSnapshotWrapper snapshotWrapper = new SonarSnapshotWrapper(
                snapshot, metricId1, metricId2, sonarDao);

        logStartOfCalc(metricId1, metricId2, minMaxValues, snapshotWrapper);

        LayoutVisitor visitor = buildLayoutVisitor(minMaxValues);

        Layout layout = new Layout(visitor);
        
        return layout.startLayout(snapshotWrapper);
    }

    private void logStartOfCalc(Integer metricId1, Integer metricId2,
            List<Double> minMaxValues, SonarSnapshotWrapper snapshotWrapper) {
        LOGGER.info("Start layout calculation for snapshot "
                + snapshotWrapper.getName() + ", " + "metrics " + metricId1
                + " and " + metricId2);

        LOGGER.info("Metric " + metricId1 + " - min : " + minMaxValues.get(0)
                + " max: " + minMaxValues.get(1));
        LOGGER.info("Metric " + metricId2 + " - min : " + minMaxValues.get(2)
                + " max: " + minMaxValues.get(3));
    }

    private LayoutVisitor buildLayoutVisitor(List<Double> minMaxValues) {
        LayoutVisitorFactory factory = softVizInjector
                .getInstance(LayoutVisitorFactory.class);

        SonarMetric footprintMetricWrapper = new SonarMetric(
                minMaxValues.get(0), minMaxValues.get(1));

        SonarMetric heightMetricWrapper = new SonarMetric(minMaxValues.get(2),
                minMaxValues.get(3));

        return factory.create(settings, footprintMetricWrapper,
                heightMetricWrapper);
    }

}
