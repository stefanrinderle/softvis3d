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

import static att.grappa.GrappaConstants.HEIGHT_ATTR;
import static att.grappa.GrappaConstants.WIDTH_ATTR;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;

public class ExecuteCommandImpl implements ExecuteCommand {
    
    @Override
    public String executeCommand(String command) {
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
    
    @Override
    public String executeDotCommand(String command, String inputGraph)
            throws DotExcecutorException {
        StringBuilder adot = new StringBuilder();

        Process process;
        try {
            process = Runtime.getRuntime().exec(command);

            BufferedWriter out = new BufferedWriter(new OutputStreamWriter(
                    process.getOutputStream()));
            out.write(inputGraph);
            out.close();

            BufferedReader in = new BufferedReader(new InputStreamReader(
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

        } catch (IOException e) {
            throw new DotExcecutorException(e.getMessage(), e);
        } catch (InterruptedException e) {
            throw new DotExcecutorException(e.getMessage(), e);
        }

        return adot.toString();
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
