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
package de.rinderle.softviz3d.depth;
import java.io.PrintStream;
import java.util.Map;
import java.util.regex.Pattern;

public class PathWalker {
    private final Node root;

    private Pattern pathSeperator = Pattern.compile("\\\\");
    
    public PathWalker(int id) {
        root = new Node(id, 0);
    }
    
    public PathWalker(int id, String pathSeperator) {
        if (pathSeperator != null) {
            this.pathSeperator = Pattern.compile(pathSeperator);
        }
        
        root = new Node(id, 0);
    }
    
    public void addPath(int id, String path) {
        String[] names = pathSeperator.split(path);
        Node node = root;
        for (String name : names) {
            node = node.getOrCreateChild(id, name);
        }
    }

    private static void printHtml(Node node, PrintStream out) {
        Map<String, Node> children = node.getChildren();
        if (children.isEmpty())
            return;
        out.println("<ul>");
        for (Map.Entry<String, Node> child : children.entrySet()) {
            out.print("<li>");
            out.print(child.getKey());
            printHtml(child.getValue(), out);
            out.println("</li>");
        }
        out.println("</ul>");
    }
    
    private static void print(Node node, PrintStream out, int depht) {
        Map<String, Node> children = node.getChildren();
        if (children.isEmpty())
            return;
        for (Map.Entry<String, Node> child : children.entrySet()) {
            
            out.println(child.getValue().getId() + " "
                    + child.getValue().getDepth() + " "
                    + child.getKey());
                    
            print(child.getValue(), out, depht + 1);
        }
    }

    public void print(PrintStream out) {
        print(root, out, 0);
    }
    
    public void printHtml(PrintStream out) {
        printHtml(root, out);
    }
    
    public Node getTree() {
        return root;
    }
}