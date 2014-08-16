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
package de.rinderle.softviz3d.dot;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.StringWriter;
import java.io.Writer;
import java.util.HashMap;
import java.util.Map;

import org.junit.Test;
import org.sonar.api.config.Settings;

import att.grappa.Graph;
import att.grappa.GrappaBox;
import att.grappa.Node;
import de.rinderle.softviz3d.layout.dot.DotExcecutor;
import de.rinderle.softviz3d.layout.dot.DotExcecutorException;
import de.rinderle.softviz3d.layout.interfaces.SoftViz3dConstants;

public class DotTranslationTest {

    @Test
    public void test() throws DotExcecutorException, IOException {
        Settings settings = new Settings();
        Map<String, String> props = new HashMap<String, String>();
        props.put(SoftViz3dConstants.DOT_BIN_KEY, "/usr/local/bin/dot");
        settings.addProperties(props);
        
        Graph result = DotExcecutor.getInstance().run(graphRoot(), settings);
        
        assertNotNull(result);
    }

    private Graph graphRoot() {
        Graph graph = new Graph("root");
        double x = 0;
        double y = 0;
        double width = 50;
        double height = 50;
        graph.setAttribute("bb", new GrappaBox(x, y, width, height));
        
        Node leaf1 = new Node(graphLeaf1());
        leaf1.setAttribute("id", "2");
        leaf1.setAttribute("buildingHeight", "10");
        graph.addNode(leaf1);
        Node leaf2 = new Node(graphLeaf2());
        leaf2.setAttribute("id", "3");
        leaf2.setAttribute("buildingHeight", "10");
        graph.addNode(leaf2);
        
        return graph;
      }
    
    private Graph graphLeaf1() {
        Graph graph = new Graph("leaf1");
        double x = 0;
        double y = 0;
        double width = 50;
        double height = 50;
        graph.setAttribute("bb", new GrappaBox(x, y, width, height));
        return graph;
      }
      
      private Graph graphLeaf2() {
        Graph graph = new Graph("leaf2");
        double x = 0;
        double y = 0;
        double width = 50;
        double height = 50;
        graph.setAttribute("bb", new GrappaBox(x, y, width, height));
        return graph;
      }
      
    private static String executeDotCommand(String command, String inputGraph, Settings settings) throws DotExcecutorException {
        // TODO SRI dont forget the other layout

//        String dotBin = settings.getString(SoftViz3dConstants.DOT_BIN_KEY);
        
        StringBuilder adot = new StringBuilder();

        Process process;
        try {
          process = Runtime.getRuntime().exec(command);

          // write dot input (Output stream from java
          BufferedWriter out = new BufferedWriter(new OutputStreamWriter(
              process.getOutputStream()));
//          inputGraph.printGraph(out);
          
          out.write(inputGraph);
          out.close();

          // read dot output ( Input stream to java)
          BufferedReader in = new BufferedReader(new InputStreamReader(
              process.getInputStream()));

          String line;
          while ((line = in.readLine()) != null) {
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
}
