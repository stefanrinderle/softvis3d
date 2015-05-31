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

import de.rinderle.softvis3d.domain.SoftVis3DConstants;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;

import static att.grappa.GrappaConstants.HEIGHT_ATTR;
import static att.grappa.GrappaConstants.WIDTH_ATTR;

public class ExecuteCommandImpl implements ExecuteCommand {

  private static final Logger LOGGER = LoggerFactory.getLogger(ExecuteCommandImpl.class);

  static String checkForAdotBug(String line) {
    String result = line;
    if (result.contains(HEIGHT_ATTR)) {
      result = addQuotationMarks(result, HEIGHT_ATTR);
    } else if (result.contains(WIDTH_ATTR) && !result.contains(SoftVis3DConstants.GRAPH_ATTR_PENWIDTH)) {
      result = result.replace(WIDTH_ATTR + "=", WIDTH_ATTR + "=\"");
      if (result.indexOf(']') >= 0) {
        result = result.replace("]", "\"]");
      } else {
        result = result + "\"";
      }
    }

    return result;
  }

  private static String addQuotationMarks(String line, final String attrName) {
    String result = line.replace(attrName + "=", attrName + "=\"");
    result = result.replace(",", "\",");
    return result;
  }

  @Override
  public String executeCommandReadErrorStream(final String command) throws DotExecutorException {
    final StringBuilder output = new StringBuilder();

    final Process p;
    try {
      p = Runtime.getRuntime().exec(command);

      final BufferedReader reader = new BufferedReader(new InputStreamReader(p.getErrorStream()));

      String line;
      while ((line = reader.readLine()) != null) {
        output.append(line);
        output.append("\n");
      }

      reader.close();
    } catch (final IOException e) {
      throw new DotExecutorException(e.getMessage(), e);
    }

    return output.toString();
  }

  @Override
  public String executeCommandReadAdot(final String command, final String inputGraph, final Version currentVersion)
    throws DotExecutorException {
    final Process process;
    try {
      process = Runtime.getRuntime().exec(command);

      writeStringToOutput(inputGraph, process);

      final String errorOutput = readOutputStream(process.getErrorStream());
      if (!StringUtils.isEmpty(errorOutput)) {
        throw new DotExecutorException(errorOutput);
      }

      return readAdotStream(currentVersion, process);

    } catch (final IOException e) {
      throw new DotExecutorException(e.getMessage(), e);
    } catch (final InterruptedException e) {
      throw new DotExecutorException(e.getMessage(), e);
    }
  }

  private String readAdotStream(final Version currentVersion, final Process process) throws IOException,
    InterruptedException {
    String line;
    final StringBuilder adotBuilder = new StringBuilder();

    final BufferedReader in = new BufferedReader(new InputStreamReader(process.getInputStream()));

    final Version startBug = new Version("2.30.0");
    // return -1 (a<b) return 0 (a=b) return 1 (a>b)
    final boolean adotBug = currentVersion.compareTo(startBug) >= 0;

    while ((line = in.readLine()) != null) {
      if (adotBug) {
        line = checkForAdotBug(line);
      }

      adotBuilder.append(line);
      adotBuilder.append("\n");
    }

    process.waitFor();
    in.close();

    return adotBuilder.toString();
  }

  private String readOutputStream(final InputStream inputStream) throws IOException {
    String result = "";

    final BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));

    if (reader.ready()) {
      String line;
      while ((line = reader.readLine()) != null) {
        result += line;
      }
      reader.close();
    }

    return result;
  }

  private void writeStringToOutput(final String inputGraph, final Process process) throws IOException {
    final BufferedWriter out = new BufferedWriter(new OutputStreamWriter(process.getOutputStream()));
    out.write(inputGraph);
    out.close();
  }
}
