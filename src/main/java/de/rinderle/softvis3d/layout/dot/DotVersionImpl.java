/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.layout.dot;

import com.google.inject.Inject;

public class DotVersionImpl implements DotVersion {

  private String version = null;

  @Inject
  private ExecuteCommand executeCommand;

  @Override
  public String getVersion(final String dotBin) {
    if (this.version == null) {
      String commandResult = this.executeCommand.executeCommandReadErrorStream(dotBin + " -V");

      // dot - Graphviz version 2.20.2 (Tue Jan 14 19:38:44 UTC 2014)

      // remove first part
      final String prefix = "dot - Graphviz version ";
      commandResult = commandResult.substring(prefix.length(), commandResult.length());

      // remove everything after the first space left
      this.version = commandResult.substring(0, commandResult.indexOf(" "));
    }

    return this.version;
  }

}
