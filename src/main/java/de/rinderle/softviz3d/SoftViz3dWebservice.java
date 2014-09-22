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
import de.rinderle.softviz3d.handler.SoftViz3dWebserviceHandler;
import de.rinderle.softviz3d.sonar.SonarDao;
import org.sonar.api.database.DatabaseSession;
import org.sonar.api.server.ws.WebService;


public class SoftViz3dWebservice implements WebService {

    private final SoftViz3dWebserviceHandler handler;

    public SoftViz3dWebservice(DatabaseSession session) {
        Injector softVizInjector = Guice.createInjector(new SoftViz3dModule());

        SonarDao sonarDao = softVizInjector.getInstance(SonarDao.class);
        sonarDao.setDatabaseSession(session);

        this.handler = softVizInjector.getInstance(SoftViz3dWebserviceHandler.class);
    }

   @Override
   public void define(Context context) {
     WebService.NewController controller = context.createController("api/softViz3d");
     controller.setDescription("SoftViz3d webservice");

     // create the URL /api/softViz3d/getSnapshotDetails
     controller.createAction("getSnapshotDetails")
       .setDescription("Entry point")
       .setHandler(this.handler)
       .createParam("snapshotId", "Snapshot id");

    // important to apply changes
    controller.done();
   }
 }