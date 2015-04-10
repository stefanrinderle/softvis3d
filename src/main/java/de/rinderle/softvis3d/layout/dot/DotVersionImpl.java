/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
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
    public Version getVersion(final String dotBin) {
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
