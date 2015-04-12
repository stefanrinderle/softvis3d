/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.webservice;

import org.sonar.api.server.ws.Response;
import de.rinderle.softvis3d.domain.tree.RootTreeNode;
import org.sonar.api.utils.text.JsonWriter;

public interface ExceptionJsonWriter {

	void transformExceptionToJson(Response response, Exception exception);
}
