/*
 * softvis3d-base
 * Copyright (C) 2015 Stefan Rinderle
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
package de.rinderle.softvis3d.base.layout.dot;

import att.grappa.Graph;
import att.grappa.Parser;
import com.google.inject.Inject;
import com.google.inject.Singleton;
import de.rinderle.softvis3d.base.layout.helper.StringOutputStream;
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
import org.apache.commons.lang.SystemUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Use singleton because of the buggy dot version 2.38.0. The bug workaround (see
 * http://www.graphviz.org/content/set-bounding-box-position-neato) has to translate the outcome based on a translation
 * file. This should created only once.
 */
@Singleton
public class DotExecutor {

  public static final Version DOT_BUG_VERSION = new Version("2.38.0");
  private static final Logger LOGGER = LoggerFactory.getLogger(DotExecutor.class);

  private File translationFile = null;

  @Inject
  private DotVersion dotVersion;

  @Inject
  private ExecuteCommand executeCommand;

  public Graph run(final Graph inputGraph, final GraphvizPath path)
    throws DotExecutorException {

    final Version currentVersion = this.dotVersion.getVersion(path);

    final Version firstNeatoVersion = new Version("2.2.1");
    // return -1 (a<b) return 0 (a=b)
    final boolean noNeato = currentVersion.compareTo(firstNeatoVersion) < 1;

    String command = path.getDotExecutable();
    if (!noNeato) {
      command = command + " -K neato";
    }

    final StringWriter writer = new StringWriter();
    inputGraph.printGraph(writer);

    final String sourceDot = writer.toString();

    String adot = this.executeCommand.executeCommandReadAdot(command, sourceDot, currentVersion);

    if (currentVersion.equals(DOT_BUG_VERSION)) {
      try {

        if (this.translationFile == null) {
          final InputStream file = DotExecutor.class.getResourceAsStream("/translate.g");
          this.translationFile = File.createTempFile("translate", ".g");
          final FileOutputStream out = new FileOutputStream(this.translationFile);
          IOUtils.copy(file, out);
        }

        final String normalizedTranslationFilePath =
          normalizeFilePath(this.translationFile.getAbsolutePath(), SystemUtils.IS_OS_WINDOWS);

        final String translationCommand = path.getGvprExecutable() + " -c -f " + normalizedTranslationFilePath;

        adot = this.executeCommand.executeCommandReadAdot(translationCommand, adot, currentVersion);
      } catch (final IOException e) {
        throw new DotExecutorException("Error on create temp file", e);
      }
    }

    return this.parseDot(adot);
  }

  String normalizeFilePath(final String sourceBin, final boolean isWindows) {
    if (isWindows) {
      // because the gvpr and not gvpr.exe is used, the slashes have to be flipped on windows.
      final String slashFlipped = sourceBin.replace("\\", "/");
      return "\"" + slashFlipped + "\"";
    } else {
      return sourceBin;
    }
  }

  private Graph parseDot(final String adot) throws DotExecutorException {
    final String graphName = "LayoutLayer";

    LOGGER.debug("----------------adot--------------------------");
    LOGGER.debug(adot);
    LOGGER.debug("----------------------------------------------");

    final Graph newGraph = new Graph("new" + graphName, true, false);

    final OutputStream output = new StringOutputStream();
    final PrintWriter errorStream = new PrintWriter(output);

    final Reader reader = new StringReader(adot);

    final Parser parser = new Parser(reader, errorStream, newGraph);

    try {
      parser.parse();
    } catch (final Exception e) {
      throw new DotExecutorException("Error on parsing graph string - parseDot: " + adot, e);
    }

    return newGraph;
  }

}
