/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.webservice.tree;

import de.rinderle.softvis3d.domain.tree.TreeNode;
import org.sonar.api.server.ws.Response;

public interface TreeNodeJsonWriter {

  void transformTreeToJson(Response response, TreeNode tree);
}
