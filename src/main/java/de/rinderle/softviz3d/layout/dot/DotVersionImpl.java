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
package de.rinderle.softviz3d.layout.dot;

import com.google.inject.Inject;
import de.rinderle.softviz3d.layout.interfaces.SoftViz3dConstants;
import org.sonar.api.config.Settings;

public class DotVersionImpl implements DotVersion {

  private String version = null;

  @Inject
  private ExecuteCommand executeCommand;

  /*
   * (non-Javadoc)
   * 
   * @see de.rinderle.softviz3d.layout.dot.DotVersion#getVersion(org.sonar.api.config.Settings)
   */
  @Override
  public String getVersion(Settings settings) {
    if (version == null) {
      String dotBin = settings.getString(SoftViz3dConstants.DOT_BIN_KEY);
      String commandResult = executeCommand.executeCommandReadErrorStream(dotBin + " -V");

      // dot - Graphviz version 2.20.2 (Tue Jan 14 19:38:44 UTC 2014)

      // remove first part
      String prefix = "dot - Graphviz version ";
      commandResult = commandResult.substring(prefix.length(), commandResult.length());

      // remove everything after the first space left
      version = commandResult.substring(0, commandResult.indexOf(" "));
    }

    return version;
  }

}
