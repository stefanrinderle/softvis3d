/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
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
package de.rinderle.softvis3d.layout.dot;

import com.google.inject.Inject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DotVersionImpl implements DotVersion {

  private static final Logger LOGGER = LoggerFactory.getLogger(DotVersionImpl.class);

  private Version version = null;

  @Inject
  private ExecuteCommand executeCommand;

  @Override
  public Version getVersion(final String dotBin) throws DotExecutorException {
    if (this.version == null) {

      String commandResult = this.executeCommand.executeCommandReadErrorStream(dotBin + " -V");

      // dot - Graphviz version 2.20.2 (Tue Jan 14 19:38:44 UTC 2014)
      // dot version 2.0 (Mon Apr 6 14:19:01 UTC 2015)

      char[] crs = commandResult.toCharArray();
      int result = 0;
      for (int i = 0; i < commandResult.length(); i++) {
        if (Character.isDigit(crs[i])) {
          result = i;
          break;
        }
      }

      // remove first part
      commandResult = commandResult.substring(result, commandResult.length());

      // remove everything after the first space left
      this.version = new Version(commandResult.substring(0, commandResult.indexOf(" ")));

      LOGGER.info("dot version---" + this.version.get() + "---");
    }

    return version;
  }

}
