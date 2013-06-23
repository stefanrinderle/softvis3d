/*
 * SoftViz3d Sonar plugin
 * Copyright (C) 2013 Stefan Rinderle
 * dev@sonar.codehaus.org
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

import att.grappa.Graph;
import att.grappa.Parser;
import de.rinderle.softviz3d.layout.helper.StringOutputStream;
import de.rinderle.softviz3d.layout.interfaces.SoftViz3dConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sonar.api.config.Settings;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.io.Reader;
import java.io.StringReader;

import static att.grappa.GrappaConstants.HEIGHT_ATTR;
import static att.grappa.GrappaConstants.WIDTH_ATTR;

public class DotExcecutor {

  private static final Logger LOGGER = LoggerFactory
      .getLogger(DotExcecutor.class);

  public static Graph run(Graph inputGraph, Settings settings) throws DotExcecutorException {
    String adot = executeDotCommand(inputGraph, settings);

    Graph outputGraph = parseDot(adot);

    return outputGraph;
  }

  private static String executeDotCommand(Graph inputGraph, Settings settings) throws DotExcecutorException {
    // TODO SRI dont forget the other layout

    String dotBin = settings.getString(SoftViz3dConstants.DOT_BIN_KEY);
    
    StringBuilder adot = new StringBuilder();
    String command = dotBin + " -K neato ";

    Process process;
    try {
      process = Runtime.getRuntime().exec(command);

      // write dot input (Output stream from java
      BufferedWriter out = new BufferedWriter(new OutputStreamWriter(
          process.getOutputStream()));
      inputGraph.printGraph(out);
      out.close();

      // read dot output ( Input stream to java)
      BufferedReader in = new BufferedReader(new InputStreamReader(
          process.getInputStream()));

      adot = new StringBuilder();
      String line;
      while ((line = in.readLine()) != null) {
        // TODO SRI !!! dirty hack !!!
        line = checkForAdotBug(line);
        adot.append(line);
        adot.append("\n");
      }

      process.waitFor();
      in.close();

    } catch (IOException e) {
      LOGGER.warn("Error on running dot command - executeDotCommand: " + e.getMessage());
      throw new DotExcecutorException(e.getMessage(), e);
    } catch (InterruptedException e) {
      LOGGER.warn("Error on reading dot command output - executeDotCommand: " + e.getMessage());
      throw new DotExcecutorException(e.getMessage(), e);
    }

    return adot.toString();
  }

  private static Graph parseDot(String adot) throws DotExcecutorException {
    String graphName = "LayoutLayer";
    boolean directed = true;
    boolean strict = false;

    Graph newGraph = new Graph("new" + graphName, directed, strict);

    OutputStream output = new StringOutputStream();
    PrintWriter errorStream = new PrintWriter(output);

    Reader reader = new StringReader(adot);

    Parser parser = new Parser(reader, errorStream, newGraph);

    // LOGGER.info(adot);

    try {
      parser.parse();
    } catch (Exception e) {
      LOGGER.warn("Error on parsing graph string - parseDot: " + e.getMessage());
      throw new DotExcecutorException(e.getMessage(), e);
    }

    return newGraph;
  }

  private static String checkForAdotBug(String line) {
    if (line.indexOf(HEIGHT_ATTR) >= 0) {
      line = addQuotationMarks(line, HEIGHT_ATTR);
    } else if (line.indexOf(WIDTH_ATTR) >= 0) {
      line = line.replace(WIDTH_ATTR + "=", WIDTH_ATTR + "=\"");
      if (line.indexOf(']') >= 0) {
        line = line.replace("]", "\"]");
      } else {
        line = line + "\"";
      }
    }

    return line;
  }

  private static String addQuotationMarks(String line, String attrName) {
    line = line.replace(attrName + "=", attrName + "=\"");
    line = line.replace(",", "\",");
    return line;
  }

}
