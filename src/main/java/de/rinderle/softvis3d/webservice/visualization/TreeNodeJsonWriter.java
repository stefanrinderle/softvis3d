/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.webservice.visualization;

import org.sonar.api.utils.text.JsonWriter;
import de.rinderle.softvis3d.domain.tree.RootTreeNode;

public interface TreeNodeJsonWriter {

	void transformTreeToJsonBla(JsonWriter jsonWriter, RootTreeNode tree);
}
