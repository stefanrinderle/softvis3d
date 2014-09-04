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

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.io.Reader;
import java.io.StringReader;
import java.io.StringWriter;

import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sonar.api.config.Settings;

import att.grappa.Graph;
import att.grappa.Parser;

import com.google.inject.Inject;
import com.google.inject.Singleton;

import de.rinderle.softviz3d.layout.helper.StringOutputStream;
import de.rinderle.softviz3d.layout.interfaces.SoftViz3dConstants;

@Singleton
public class DotExcecutorImpl implements DotExecutor {

    private static final Logger LOGGER = LoggerFactory
            .getLogger(DotExcecutorImpl.class);
    
    public static final String DOT_BUG_VERSION = "2.38.0";

    private File translationFile = null;

    @Inject
    private DotVersion dotVersion;
    
    @Inject 
    private ExecuteCommand executeCommand;
    
    @Override
    public Graph run(Graph inputGraph, Settings settings)
            throws DotExcecutorException {
        StringWriter writer = new StringWriter();
        inputGraph.printGraph(writer);

        String dotBin = settings.getString(SoftViz3dConstants.DOT_BIN_KEY);
        String command = dotBin + " -K neato ";
        
        String adot = executeCommand.executeDotCommand(command, writer.toString());

        if (dotVersion.getVersion(settings).equals(DOT_BUG_VERSION)) {
            try {
                
            if (translationFile == null) {
                InputStream file = DotExcecutorImpl.class.getResourceAsStream("/translate.g");
                translationFile = File.createTempFile("transate", ".g");
                FileOutputStream out = new FileOutputStream(translationFile);
                IOUtils.copy(file, out);
            } 
                
              String translationCommand = "/usr/local/bin/gvpr -c -f " + translationFile.getAbsolutePath();
              
              adot = executeCommand.executeDotCommand(translationCommand, adot);
            } catch (IOException e) {
                LOGGER.error("Error on create temp file", e);
            }
        }
        
        return parseDot(adot);
    }

    private Graph parseDot(String adot) throws DotExcecutorException {
        String graphName = "LayoutLayer";
        boolean directed = true;
        boolean strict = false;

        Graph newGraph = new Graph("new" + graphName, directed, strict);

        OutputStream output = new StringOutputStream();
        PrintWriter errorStream = new PrintWriter(output);

        Reader reader = new StringReader(adot);

        Parser parser = new Parser(reader, errorStream, newGraph);

        try {
            parser.parse();
        } catch (Exception e) {
            LOGGER.error("Error on parsing graph string - parseDot: "
                    + e.getMessage());
            throw new DotExcecutorException(e.getMessage(), e);
        }

        return newGraph;
    }

}
