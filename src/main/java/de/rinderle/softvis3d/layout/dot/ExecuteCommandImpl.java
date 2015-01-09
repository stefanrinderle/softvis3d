/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.layout.dot;

import de.rinderle.softvis3d.domain.SoftVis3DConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;

import static att.grappa.GrappaConstants.HEIGHT_ATTR;
import static att.grappa.GrappaConstants.WIDTH_ATTR;

public class ExecuteCommandImpl implements ExecuteCommand {

	private static final Logger LOGGER = LoggerFactory
			.getLogger(ExecuteCommandImpl.class);

	private static String checkForAdotBug(String line) {
		if (line.contains(HEIGHT_ATTR)) {
			line = addQuotationMarks(line, HEIGHT_ATTR);
		} else if (line.contains(WIDTH_ATTR)
				&& !line.contains(SoftVis3DConstants.GRAPH_ATTR_PENWIDTH)) {
			line = line.replace(WIDTH_ATTR + "=", WIDTH_ATTR + "=\"");
			if (line.indexOf(']') >= 0) {
				line = line.replace("]", "\"]");
			} else {
				line = line + "\"";
			}
		}

		return line;
	}

	private static String addQuotationMarks(String line, final String attrName) {
		line = line.replace(attrName + "=", attrName + "=\"");
		line = line.replace(",", "\",");
		return line;
	}

	@Override
	public String executeCommandReadErrorStream(final String command) {
		final StringBuilder output = new StringBuilder();

		final Process p;
		try {
			p = Runtime.getRuntime().exec(command);

			final BufferedReader reader = new BufferedReader(
					new InputStreamReader(p.getErrorStream()));

			String line;
			while ((line = reader.readLine()) != null) {
				output.append(line);
				output.append("\n");
			}

			reader.close();
		} catch (final IOException e) {
			LOGGER.error(e.getMessage(), e);
		}

		return output.toString();
	}

	@Override
	public String executeCommandReadAdot(final String command,
			final String inputGraph) throws DotExecutorException {
		final StringBuilder adot = new StringBuilder();

		final Process process;
		try {
			process = Runtime.getRuntime().exec(command);

			final BufferedWriter out = new BufferedWriter(
					new OutputStreamWriter(process.getOutputStream()));
			out.write(inputGraph);
			out.close();

			final BufferedReader in = new BufferedReader(new InputStreamReader(
					process.getInputStream()));

			String line;
			while ((line = in.readLine()) != null) {
				// TODO SRI !!! dirty hack !!!
				line = checkForAdotBug(line);
				adot.append(line);
				adot.append("\n");
			}

			process.waitFor();
			in.close();

		} catch (final IOException e) {
			throw new DotExecutorException(e.getMessage(), e);
		} catch (final InterruptedException e) {
			throw new DotExecutorException(e.getMessage(), e);
		}

		return adot.toString();
	}
}
