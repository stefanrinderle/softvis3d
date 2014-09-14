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

import com.google.inject.Inject;
import com.google.inject.Singleton;
import de.rinderle.softviz3d.sonar.SonarDao;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Singleton
public class ResourceTreeServiceImpl implements ResourceTreeService {

    private static final Logger LOGGER = LoggerFactory
            .getLogger(ResourceTreeServiceImpl.class);

    private PathWalker pathWalker;

    @Inject
    private SonarDao sonarDao;

    @Override
    public void createTreeStructrue(int rootSnapshotId) {
        pathWalker = new PathWalker(rootSnapshotId);

        List<Object[]> flatChildren = sonarDao.getAllChildrenFlat(rootSnapshotId);

        for (Object[] flatChild : flatChildren) {
            pathWalker.addPath((Integer) flatChild[0], (String) flatChild[1]);
            LOGGER.debug("addPath " + flatChild[0] + " " + flatChild[1]);
        }

        LOGGER.debug("................");
        pathWalker.print();
        LOGGER.debug("................");
    }

    @Override
    public List<Integer> getChildrenNodeIds(Integer id) {
        Node node = recursiveSearch(id, pathWalker.getTree());
        
        return getChildrenNodes(node.getChildren());
    }
    
    @Override
    public List<Integer> getChildrenLeafIds(Integer id) {
        Node node = recursiveSearch(id, pathWalker.getTree());
        
        return getChildrenLeaves(node.getChildren());
    }

    private Node recursiveSearch(Integer id, Node node) {
        if (node.getId() == id) {
            /**
             * check if there is a child node with the same id.
             * This is to parse long paths and get the last node
             * of the chain with the same id.
             */
            for (Node child : node.getChildren().values()) {
                if (child.getId() == id) {
                    return recursiveSearch(id, child);
                }
            }

            return node;
        }
        
        Map<String, Node> children = node.getChildren();
        Node temp;
        if (!children.isEmpty()) {
            for (Node child : children.values()) {
                temp = recursiveSearch(id, child);
                if (temp != null) {
                    return temp;
                }
            }
        }

        return null;
    }

    private List<Integer> getChildrenNodes(Map<String, Node> children) {
        List<Integer> result = new ArrayList<Integer>();

        for (Node child : children.values()) {
            if (!child.getChildren().isEmpty()) {
                result.add(child.getId());
            }
        }

        return result;
    }
    
    private List<Integer> getChildrenLeaves(Map<String, Node> children) {
        List<Integer> result = new ArrayList<Integer>();

        for (Node child : children.values()) {
            if (child.getChildren().isEmpty()) {
                result.add(child.getId());
            }
        }

        return result;
    }
    
}
