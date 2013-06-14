package de.rinderle.softviz3d.dot;

import static att.grappa.GrappaConstants.HEIGHT_ATTR;
import static att.grappa.GrappaConstants.WIDTH_ATTR;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.io.Reader;
import java.io.StringReader;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import att.grappa.Graph;
import att.grappa.Parser;

public class DotExcecutor {

	private static final String ATTR_NAME_METRIC2 = "metric2";
	private static final String ATTR_NAME_METRIC1 = "metric1";
	private static final Logger LOGGER = LoggerFactory
			.getLogger(DotExcecutor.class);

	public static Graph run(Graph inputGraph) throws DotExcecutorException {
		String adot = executeDotCommand(inputGraph);

		Graph outputGraph = parseDot(adot);

		return outputGraph;
	}

	private static String executeDotCommand(Graph inputGraph) throws DotExcecutorException {
		StringBuilder adot = new StringBuilder();
		String command = "/usr/local/bin/dot -K neato ";

		// TODO SRI dont forget the other layout
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
			if (line.indexOf("]") >= 0) {
				line = line.replace("]", "\"]");
			} else {
				line = line + "\"";
			}
		} else if (line.indexOf(ATTR_NAME_METRIC1) >= 0) {
			line = addQuotationMarks(line, ATTR_NAME_METRIC1);
		} else if (line.indexOf(ATTR_NAME_METRIC2) >= 0) {
			line = addQuotationMarks(line, ATTR_NAME_METRIC2);
		}

		return line;
	}

	private static String addQuotationMarks(String line, String attr_name) {
		line = line.replace(attr_name + "=", attr_name + "=\"");
		line = line.replace(",", "\",");
		return line;
	}

}
