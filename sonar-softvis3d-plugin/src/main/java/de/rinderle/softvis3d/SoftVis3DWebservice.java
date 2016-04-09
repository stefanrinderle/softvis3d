/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2015 Stefan Rinderle
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

import com.google.inject.Guice;
import com.google.inject.Injector;
import de.rinderle.softvis3d.base.VisualizationSettings;
import de.rinderle.softvis3d.base.guice.SoftVis3DModule;
import de.rinderle.softvis3d.domain.SoftVis3DConstants;
import de.rinderle.softvis3d.webservice.ConfigWebserviceHandler;
import de.rinderle.softvis3d.webservice.VisualizationWebserviceHandler;
import org.sonar.api.config.Settings;
import org.sonar.api.server.ws.WebService;

public class SoftVis3DWebservice implements WebService {

  private final VisualizationWebserviceHandler visualizationHandler;
  private final ConfigWebserviceHandler configHandler;

  public SoftVis3DWebservice(final Settings settings) {
    final Injector softVis3DInjector = Guice.createInjector(new SoftVis3DModule());

//    final SonarDao sonarDao = softVis3DInjector.getInstance(SonarDao.class);
//    sonarDao.setDatabaseSession(session);
//    final DependencyDao dependencyDao = softVis3DInjector.getInstance(DependencyDao.class);
//    dependencyDao.setDatabaseSession(session);

    this.configHandler = softVis3DInjector.getInstance(ConfigWebserviceHandler.class);
    this.configHandler.setSettings(settings);
//    this.configHandler.setDatabaseSession(session);
    this.visualizationHandler = softVis3DInjector.getInstance(VisualizationWebserviceHandler.class);
    final VisualizationSettings visualizationSettings = new VisualizationSettings(settings.getString(SoftVis3DConstants.DOT_BIN_KEY));
    this.visualizationHandler.setSettings(visualizationSettings);
//    this.visualizationHandler.setDatabaseSession(session);
  }

//  @Override
  public void define(final Context context) {
    final WebService.NewController controller = context.createController("api/softVis3D");
    controller.setDescription("SoftVis3D webservice");

    controller.createAction("getConfig").setDescription("Get config for snapshot").setHandler(this.configHandler)
      .createParam("snapshotId", "Snapshot id");

    // create the URL /api/softVis3D/getVisualization
    controller.createAction("getVisualization").setDescription("Get getVisualization structure")
      .setHandler(this.visualizationHandler).createParam("snapshotId", "Snapshot id")
      .createParam("footprintMetricId", "Footprint metric id")
      .createParam("heightMetricId", "Height metric id")
      .createParam("viewType", "Current view type")
      .createParam("scmMetricType", "Current scm calc type");

    // important to apply changes
    controller.done();
  }
}
