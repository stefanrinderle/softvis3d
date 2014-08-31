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

import com.google.inject.Binding;
import com.google.inject.Guice;
import com.google.inject.Injector;

import de.rinderle.softviz3d.guice.LayoutVisitorFactory;
import de.rinderle.softviz3d.guice.SoftViz3dModule;
import de.rinderle.softviz3d.layout.Layout;
import de.rinderle.softviz3d.layout.calc.LayoutVisitor;
import de.rinderle.softviz3d.layout.dot.DotExcecutorException;
import de.rinderle.softviz3d.sonar.SonarDao;
import de.rinderle.softviz3d.sonar.SonarMetric;
import de.rinderle.softviz3d.sonar.SonarSnapshot;
import de.rinderle.softviz3d.sonar.SonarSnapshotWrapper;

public class SoftViz3dExtension implements ServerExtension {

    private static final Logger LOGGER = LoggerFactory
            .getLogger(SoftViz3dExtension.class);

    private Settings settings;
    private SonarDao dao;

    private Injector softVizInjector;

    // @Inject
    // private LayoutVisitorFactory visitorFactory;

    public SoftViz3dExtension(DatabaseSession session, Settings settings) {
        this.dao = new SonarDao(session);

        this.settings = settings;

        /*
         * Guice.createInjector() takes your Modules, and returns a new Injector
         * instance. Most applications will call this method exactly once, in
         * their main() method.
         */
        softVizInjector = Guice.createInjector(new SoftViz3dModule());
    }

    public List<Integer> getMetricsForSnapshot(Integer snapshotId) {
        LOGGER.info("getMetricsForSnapshot " + snapshotId);

        return dao.getDefinedMetricsForSnapshot(snapshotId);
    }

    public Map<Integer, Graph> createLayoutBySnapshotId(Integer snapshotId)
            throws DotExcecutorException {
        Integer metricId1 = this.getMetric1FromSettings();
        Integer metricId2 = this.getMetric2FromSettings();

        return createLayoutBySnapshotId(snapshotId, metricId1, metricId2);
    }

    public Integer getMetric1FromSettings() {
        return dao.getMetricIdByName(settings.getString("metric1"));
    }

    public Integer getMetric2FromSettings() {
        return dao.getMetricIdByName(settings.getString("metric2"));
    }

    public Map<Integer, Graph> createLayoutBySnapshotId(Integer snapshotId,
            String metricId1, String metricId2) throws DotExcecutorException {
        return createLayoutBySnapshotId(snapshotId, Integer.valueOf(metricId1),
                Integer.valueOf(metricId2));
    }

    private Map<Integer, Graph> createLayoutBySnapshotId(Integer snapshotId,
            Integer metricId1, Integer metricId2) throws DotExcecutorException {
        LOGGER.info("Startup SoftViz3d plugin with snapshot " + snapshotId);

        List<Double> minMaxValues = dao.getMinMaxMetricValuesByRootSnapshotId(
                snapshotId, metricId1, metricId2);

        SonarMetric footprintMetricWrapper = new SonarMetric(
                minMaxValues.get(0), minMaxValues.get(1));

        SonarMetric heightMetricWrapper = new SonarMetric(minMaxValues.get(2),
                minMaxValues.get(3));

        SonarSnapshot snapshot = dao.getSnapshotById(snapshotId, metricId1,
                metricId2);
        SonarSnapshotWrapper snapshotWrapper = new SonarSnapshotWrapper(
                snapshot, metricId1, metricId2, dao);

        LOGGER.info("Start layout calculation for snapshot "
                + snapshotWrapper.getName() + ", " + "metrics " + metricId1
                + " and " + metricId2);

        LOGGER.info("Metric " + metricId1 + " - min : " + minMaxValues.get(0)
                + " max: " + minMaxValues.get(1));
        LOGGER.info("Metric " + metricId2 + " - min : " + minMaxValues.get(2)
                + " max: " + minMaxValues.get(3));

        LayoutVisitorFactory factory = softVizInjector
                .getInstance(LayoutVisitorFactory.class);

        LayoutVisitor visitor = factory.create(settings,
                footprintMetricWrapper, heightMetricWrapper);

        Layout layout = new Layout(visitor);
        Map<Integer, Graph> result = layout.startLayout(snapshotWrapper);

        return result;
    }

}
