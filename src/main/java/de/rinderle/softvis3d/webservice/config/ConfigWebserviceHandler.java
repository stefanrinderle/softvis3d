/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.webservice.config;

import org.sonar.api.config.Settings;
import org.sonar.api.server.ws.RequestHandler;

public interface ConfigWebserviceHandler extends RequestHandler {

    void setSettings(Settings settings);
}
