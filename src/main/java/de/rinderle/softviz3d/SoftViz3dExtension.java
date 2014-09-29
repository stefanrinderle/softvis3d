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
import com.google.inject.Guice;
import com.google.inject.Injector;
import de.rinderle.softviz3d.guice.SoftViz3dModule;
import de.rinderle.softviz3d.layout.calc.Layout;
import de.rinderle.softviz3d.layout.dot.DotExcecutorException;
import de.rinderle.softviz3d.sonar.DependenyDao;
import de.rinderle.softviz3d.sonar.SonarDao;
import de.rinderle.softviz3d.sonar.SonarService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sonar.api.ServerExtension;
import org.sonar.api.config.Settings;
import org.sonar.api.database.DatabaseSession;

import java.util.List;
import java.util.Map;

public class SoftViz3dExtension implements ServerExtension {

    private static final Logger LOGGER = LoggerFactory
            .getLogger(SoftViz3dExtension.class);

    private Settings settings;

    private SonarService sonarService;

    private Injector softVizInjector;
    
    public SoftViz3dExtension(DatabaseSession session, Settings settings) {
        this.settings = settings;

        softVizInjector = Guice.createInjector(new SoftViz3dModule());

        SonarDao sonarDao = softVizInjector.getInstance(SonarDao.class);
        sonarDao.setDatabaseSession(session);
        DependenyDao dependenyDao = softVizInjector.getInstance(DependenyDao.class);
        dependenyDao.setDatabaseSession(session);

        this.sonarService = softVizInjector.getInstance(SonarService.class);
    }

    public List<Integer> getMetricsForSnapshot(Integer snapshotId) {
        LOGGER.info("getMetricsForSnapshot " + snapshotId);

        return sonarService.getDefinedMetricsForSnapshot(snapshotId);
    }

    public Integer getMetric1FromSettings() {
        return sonarService.getMetric1FromSettings(settings);
    }

    public Integer getMetric2FromSettings() {
        return sonarService.getMetric2FromSettings(settings);
    }

    public Map<Integer, Graph> createLayoutBySnapshotId(Integer snapshotId,
            String metricString1, String metricString2) throws DotExcecutorException {
        LOGGER.info("Startup SoftViz3d plugin with snapshot " + snapshotId);

        logStartOfCalc(metricString1, metricString2, snapshotId);

        Integer metricId1 = Integer.valueOf(metricString1);
        Integer metricId2 = Integer.valueOf(metricString2);
        
        Layout layout = softVizInjector.getInstance(Layout.class);

        return layout.startLayout(settings, snapshotId, metricId1, metricId2);
    }

    public String getSnapshotDetails(Integer id, String metricString1, String metricString2) {

        LOGGER.info("getSnapshotDetails " + id);

//        Integer id = Integer.valueOf(idString);
        Integer metricId1 = Integer.valueOf(metricString1);
        Integer metricId2 = Integer.valueOf(metricString2);

        return sonarService.getSnapshotDetails(id, metricId1, metricId2, 0);
    }

    private void logStartOfCalc(String metricId1, String metricId2,
            Integer snapshotId) {
        LOGGER.info("Start layout calculation for snapshot "
                + snapshotId + ", " + "metrics " + metricId1
                + " and " + metricId2);
    }

}
