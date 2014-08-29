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

import de.rinderle.softviz3d.layout.helper.StringOutputStream;
import de.rinderle.softviz3d.layout.interfaces.SoftViz3dConstants;

public class DotExcecutor {

    private static final Logger LOGGER = LoggerFactory
            .getLogger(DotExcecutor.class);

    private File translationFile = null;

    @Inject
    private DotVersion dotVersion;
    
    public Graph run(Graph inputGraph, Settings settings)
            throws DotExcecutorException {
        StringWriter writer = new StringWriter();
        inputGraph.printGraph(writer);

        String dotBin = settings.getString(SoftViz3dConstants.DOT_BIN_KEY);
        String command = dotBin + " -K neato ";
        
        String adot = ExecuteCommand.executeCommand(command, writer.toString());

        if (dotVersion.getVersion(settings).equals("2.38.0")) {
            try {
                
            if (translationFile == null) {
                InputStream file = DotExcecutor.class.getResourceAsStream("/translate.g");
                translationFile = File.createTempFile("transate", ".g");
                FileOutputStream out = new FileOutputStream(translationFile);
                IOUtils.copy(file, out);
            } 
                
              String translationCommand = "/usr/local/bin/gvpr -c -f " + translationFile.getAbsolutePath();
              
              adot = ExecuteCommand.executeCommand(translationCommand, adot);
            } catch (IOException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        }
        
        Graph outputGraph = parseDot(adot);

        return outputGraph;
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

         LOGGER.info(adot);

        try {
            parser.parse();
        } catch (Exception e) {
            LOGGER.warn("Error on parsing graph string - parseDot: "
                    + e.getMessage());
            throw new DotExcecutorException(e.getMessage(), e);
        }

        return newGraph;
    }

}
