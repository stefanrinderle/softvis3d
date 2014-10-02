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
package de.rinderle.softviz3d.tree;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;
import java.util.regex.Pattern;

public class PathWalker {
    private static final Logger LOGGER = LoggerFactory
            .getLogger(PathWalker.class);

    private int generatedIdSequence = Integer.MAX_VALUE - 100000;
    private final TreeNode root;

    private Pattern pathSeparator = Pattern.compile("/");
    
    public PathWalker(int id) {
        root = new TreeNode(id, null, 0, TreeNodeType.TREE, "root", 0, 0);
    }

    public int getNextSequence() {
        return generatedIdSequence++;
    }

    public void addPath(int id, String path, double heightMetricValue, double footprintMetricValue) {
        String[] names = pathSeparator.split(path);
        TreeNode treeNode = root;

        boolean isLastIndex;
        for(int i = 0; i < names.length; i++) {
            isLastIndex = (i == (names.length - 1));
            if (isLastIndex) {
                treeNode = treeNode.getOrCreateChild(id, names[i], TreeNodeType.TREE, heightMetricValue, footprintMetricValue);
            } else {
                treeNode = treeNode.getOrCreateChild(generatedIdSequence++, names[i], TreeNodeType.PATH_GENERATED,
                        heightMetricValue, footprintMetricValue);
            }
        }
    }

    private static void print(TreeNode treeNode, int depth) {
        Map<String, TreeNode> children = treeNode.getChildren();
        if (children.isEmpty()) {
            return;
        }

        for (Map.Entry<String, TreeNode> child : children.entrySet()) {
            
            LOGGER.debug(child.getValue().getId() + " "
                    + child.getKey());
                    
            print(child.getValue(), depth + 1);
        }
    }

    public void print() {
        print(root, 0);
    }
    
    public TreeNode getTree() {
        return root;
    }
}