/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.layout.dot;

import att.grappa.Graph;
import att.grappa.Parser;
import com.google.inject.Inject;
import com.google.inject.Singleton;
import de.rinderle.softvis3d.domain.LayoutViewType;
import de.rinderle.softvis3d.domain.SoftVis3DConstants;
import de.rinderle.softvis3d.layout.helper.StringOutputStream;
import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sonar.api.config.Settings;

import java.io.*;

/**
 * Use singleton because of the buggy dot version 2.38.0.
 * The bug workaround (see http://www.graphviz.org/content/set-bounding-box-position-neato)
 * has to translate the outcome based on a translation file. This should created
 * only once.
 */
@Singleton
public class DotExecutorImpl implements DotExecutor {

  public static final String DOT_BUG_VERSION = "2.38.0";
  private static final Logger LOGGER = LoggerFactory
    .getLogger(DotExecutorImpl.class);

  private File translationFile = null;

  @Inject
  private DotVersion dotVersion;

  @Inject
  private ExecuteCommand executeCommand;

  @Override
  public Graph run(final Graph inputGraph, final Settings settings, final LayoutViewType viewType)
    throws DotExecutorException {

    final String dotBin = settings.getString(SoftVis3DConstants.DOT_BIN_KEY);
    String command = dotBin + " ";
    if (LayoutViewType.CITY.equals(viewType) || inputGraph.edgeElementsAsArray().length == 0) {
      command = dotBin + " -K neato ";
    }

    final StringWriter writer = new StringWriter();
    inputGraph.printGraph(writer);
    String adot = this.executeCommand.executeCommandReadAdot(command, writer.toString());

    if (this.dotVersion.getVersion(dotBin).equals(DOT_BUG_VERSION)) {
      try {

        if (this.translationFile == null) {
          final InputStream file = DotExecutorImpl.class
            .getResourceAsStream("/translate.g");
          this.translationFile = File.createTempFile("translate", ".g");
          final FileOutputStream out = new FileOutputStream(this.translationFile);
          IOUtils.copy(file, out);
        }

        final int lastIndex = dotBin.lastIndexOf("/");
        final String translationBin = dotBin.substring(0, lastIndex + 1);
        final String translationCommand = translationBin + "gvpr -c -f "
          + this.translationFile.getAbsolutePath();

        adot = this.executeCommand.executeCommandReadAdot(translationCommand,
          adot);
      } catch (final IOException e) {
        LOGGER.error("Error on create temp file", e);
      }
    }

    return this.parseDot(adot);
  }

  private Graph parseDot(final String adot) throws DotExecutorException {
    final String graphName = "LayoutLayer";

    final Graph newGraph = new Graph("new" + graphName, true, false);

    final OutputStream output = new StringOutputStream();
    final PrintWriter errorStream = new PrintWriter(output);

    final Reader reader = new StringReader(adot);

    final Parser parser = new Parser(reader, errorStream, newGraph);

    try {
      parser.parse();
    } catch (final Exception e) {
      LOGGER.error("Error on parsing graph string - parseDot: "
        + e.getMessage());
      throw new DotExecutorException(e.getMessage(), e);
    }

    return newGraph;
  }

}
