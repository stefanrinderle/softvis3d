/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d;

import com.google.inject.Guice;
import com.google.inject.Injector;
import de.rinderle.softvis3d.dao.DependencyDao;
import de.rinderle.softvis3d.dao.SonarDao;
import de.rinderle.softvis3d.guice.SoftVis3DModule;
import de.rinderle.softvis3d.webservice.tree.TreeWebserviceHandler;
import de.rinderle.softvis3d.webservice.visualization.VisualizationWebserviceHandler;
import org.sonar.api.config.Settings;
import org.sonar.api.database.DatabaseSession;
import org.sonar.api.server.ws.WebService;

public class SoftVis3DWebservice implements WebService {

  private final TreeWebserviceHandler treeHandler;
  private final VisualizationWebserviceHandler visualizationHandler;

  public SoftVis3DWebservice(final DatabaseSession session, final Settings settings) {
    final Injector softVis3DInjector = Guice.createInjector(new SoftVis3DModule());

    final SonarDao sonarDao = softVis3DInjector.getInstance(SonarDao.class);
    sonarDao.setDatabaseSession(session);
    final DependencyDao dependencyDao = softVis3DInjector.getInstance(DependencyDao.class);
    dependencyDao.setDatabaseSession(session);

    this.treeHandler = softVis3DInjector.getInstance(TreeWebserviceHandler.class);
    this.visualizationHandler = softVis3DInjector.getInstance(VisualizationWebserviceHandler.class);
    this.visualizationHandler.setSettings(settings);
  }

  @Override
  public void define(final Context context) {
    final WebService.NewController controller = context.createController("api/softVis3D");
    controller.setDescription("SoftVis3D webservice");

    // create the URL /api/softVis3D/getTree
    controller.createAction("getTree")
      .setDescription("Get tree structure")
      .setHandler(this.treeHandler)
      .createParam("snapshotId", "Snapshot id")
      .createParam("footprintMetricId", "Footprint metric id")
      .createParam("heightMetricId", "Height metric id")
      .createParam("viewType", "Current view type");

    // create the URL /api/softVis3D/getVisualization
    controller.createAction("getVisualization")
            .setDescription("Get getVisualization structure")
            .setHandler(this.visualizationHandler)
            .createParam("snapshotId", "Snapshot id")
            .createParam("footprintMetricId", "Footprint metric id")
            .createParam("heightMetricId", "Height metric id")
            .createParam("viewType", "Current view type");

    // important to apply changes
    controller.done();
  }
}
