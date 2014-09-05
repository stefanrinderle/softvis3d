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
import java.util.Map;
import java.util.regex.Pattern;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class PathWalker {
    private static final Logger LOGGER = LoggerFactory
            .getLogger(PathWalker.class);
    
    private final Node root;

    private Pattern pathSeperator = Pattern.compile("\\\\");
    
    public PathWalker(int id) {
        int depth = 0;
        root = new Node(id, depth);
    }
    
    public PathWalker(int id, String pathSeperator) {
        if (pathSeperator != null) {
            this.pathSeperator = Pattern.compile(pathSeperator);
        }
        
        int depth = 0;
        root = new Node(id, depth);
    }
    
    public void addPath(int id, String path) {
        String[] names = pathSeperator.split(path);
        Node node = root;
        for (String name : names) {
            node = node.getOrCreateChild(id, name);
        }
    }

    private static void print(Node node, int depht) {
        Map<String, Node> children = node.getChildren();
        if (children.isEmpty())
            return;
        for (Map.Entry<String, Node> child : children.entrySet()) {
            
            LOGGER.debug(child.getValue().getId() + " "
                    + child.getValue().getDepth() + " "
                    + child.getKey());
                    
            print(child.getValue(), depht + 1);
        }
    }

    public void print() {
        print(root, 0);
    }
    
    public Node getTree() {
        return root;
    }
}