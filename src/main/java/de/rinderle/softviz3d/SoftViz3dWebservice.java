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

import com.google.inject.Guice;
import com.google.inject.Injector;
import de.rinderle.softviz3d.guice.SoftViz3dModule;
import de.rinderle.softviz3d.handler.SoftViz3dWebserviceInitializeHandler;
import de.rinderle.softviz3d.sonar.DependencyDao;
import de.rinderle.softviz3d.sonar.SonarDao;
import org.sonar.api.database.DatabaseSession;
import org.sonar.api.server.ws.WebService;

public class SoftViz3dWebservice implements WebService {

  private final SoftViz3dWebserviceInitializeHandler initializeHandler;

  public SoftViz3dWebservice(final DatabaseSession session) {
    final Injector softVizInjector = Guice.createInjector(new SoftViz3dModule());

    final SonarDao sonarDao = softVizInjector.getInstance(SonarDao.class);
    sonarDao.setDatabaseSession(session);

    final DependencyDao dependencyDao = softVizInjector.getInstance(DependencyDao.class);
    dependencyDao.setDatabaseSession(session);

    this.initializeHandler = softVizInjector.getInstance(SoftViz3dWebserviceInitializeHandler.class);
  }

  @Override
  public void define(final Context context) {
    final WebService.NewController controller = context.createController("api/softViz3d");
    controller.setDescription("SoftViz3d webservice");

    // create the URL /api/softViz3d/initialize
    controller.createAction("initialize")
      .setDescription("Initialize point")
      .setHandler(this.initializeHandler)
      .createParam("snapshotId", "Snapshot id")
      .createParam("footprintMetricId", "Footprint metric id")
      .createParam("heightMetricId", "Height metric id")
      .createParam("viewType", "Current view type");
    // important to apply changes
    controller.done();
  }
}
