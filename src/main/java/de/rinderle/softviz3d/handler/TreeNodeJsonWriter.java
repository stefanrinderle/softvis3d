package de.rinderle.softviz3d.handler;

import de.rinderle.softviz3d.tree.TreeNode;
import org.sonar.api.utils.text.JsonWriter;

/**
 * Created by stefan on 03.11.14.
 */
public interface TreeNodeJsonWriter {

  void transformTreeToJson(JsonWriter jsonWriter, TreeNode tree);

}
