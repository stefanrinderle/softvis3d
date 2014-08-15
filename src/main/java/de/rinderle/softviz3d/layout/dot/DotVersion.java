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

import java.io.BufferedReader;
import java.io.InputStreamReader;

import org.sonar.api.config.Settings;

import de.rinderle.softviz3d.layout.interfaces.SoftViz3dConstants;

public class DotVersion {

    private static DotVersion instance;

    private String version = null;

    private DotVersion() {
    }

    public static DotVersion getInstance() {
        if (DotVersion.instance == null) {
            DotVersion.instance = new DotVersion();
        }
        return DotVersion.instance;
    }

    public String getVersion(Settings settings) {
        if (version == null) {
            String dotBin = settings.getString(SoftViz3dConstants.DOT_BIN_KEY);
            String commandResult = executeCommand(dotBin + " -V");

            // dot - Graphviz version 2.20.2 (Tue Jan 14 19:38:44 UTC 2014)
            
            // remove first part
            String prefix = "dot - Graphviz version ";
            commandResult = commandResult.substring(prefix.length(), commandResult.length());
            
            // remove everything after the first space left
            version = commandResult.substring(0, commandResult.indexOf(" "));
        }
        
        return version;
    }

    private String executeCommand(String command) {
        StringBuffer output = new StringBuffer();

        Process p;
        try {
            p = Runtime.getRuntime().exec(command);
            BufferedReader reader = new BufferedReader(new InputStreamReader(
                    p.getErrorStream()));

            String line = "";
            while ((line = reader.readLine()) != null) {
                output.append(line + "\n");
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return output.toString();

    }
}
