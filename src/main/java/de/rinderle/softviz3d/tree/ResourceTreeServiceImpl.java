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
import de.rinderle.softviz3d.layout.calc.DependencyType;
import de.rinderle.softviz3d.sonar.SonarDao;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Singleton
public class ResourceTreeServiceImpl implements ResourceTreeService {
    private static final Logger LOGGER = LoggerFactory.getLogger(ResourceTreeServiceImpl.class);
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
    public List<TreeNode> getChildrenNodeIds(Integer id) {
        TreeNode treeNode = recursiveSearch(id, pathWalker.getTree());

        return getChildrenNodes(treeNode.getChildren());
    }

    @Override
    public List<TreeNode> getChildrenLeafIds(Integer id) {
        TreeNode treeNode = recursiveSearch(id, pathWalker.getTree());

        return getChildrenLeaves(treeNode.getChildren());
    }

    @Override
    public TreeNode findNode(final Integer id) {
        return recursiveSearch(id, pathWalker.getTree());
    }

    @Override
    public Integer addInterfaceLeafNode(final String intLeafLabel, final Integer parentId) {
        // search for parent node
        TreeNode parent = recursiveSearch(parentId, pathWalker.getTree());

        Integer id = pathWalker.getNextSequence();
        final TreeNode interfaceLeafTreeNode = new TreeNode(id, parent, parent.getDepth() + 1, TreeNodeType.DEPENDENCY_GENERATED);
        parent.getChildren().put(intLeafLabel, interfaceLeafTreeNode);

        return interfaceLeafTreeNode.getId();
    }

    @Override
    public TreeNode findInterfaceLeafNode(final String intLeafLabel) {
        return recursiveSearch(intLeafLabel, pathWalker.getTree());
    }

    @Override
    public DependencyType getDependencyType(final Integer fromSnapshotId, final Integer toSnapshotId) {
        TreeNode from = findNode(fromSnapshotId);
        TreeNode to = findNode(toSnapshotId);

        boolean hasSameParent = from.getParent().getId() == to.getParent().getId();

        if (hasSameParent) {
            return DependencyType.INPUT_FLAT;
        } else {
            return DependencyType.INPUT_TREE;
        }
    }

    private TreeNode recursiveSearch(String name, TreeNode treeNode) {
        Map<String, TreeNode> children = treeNode.getChildren();
        TreeNode temp;

        if (children.containsKey(name)) {
            return children.get(name);
        } else if (!children.isEmpty()) {
            for (TreeNode child : children.values()) {
                temp = recursiveSearch(name, child);
                if (temp != null) {
                    return temp;
                }
            }
        }

        return null;
    }

    private TreeNode recursiveSearch(Integer id, TreeNode treeNode) {
        if (treeNode.getId() == id) {
            /**
             * check if there is a child treeNode with the same id.
             * This is to parse long paths and get the last treeNode
             * of the chain with the same id.
             */
            for (TreeNode child : treeNode.getChildren().values()) {
                if (child.getId() == id) {
                    return recursiveSearch(id, child);
                }
            }

            return treeNode;
        }

        Map<String, TreeNode> children = treeNode.getChildren();
        TreeNode temp;
        if (!children.isEmpty()) {
            for (TreeNode child : children.values()) {
                temp = recursiveSearch(id, child);
                if (temp != null) {
                    return temp;
                }
            }
        }

        return null;
    }

    private List<TreeNode> getChildrenNodes(Map<String, TreeNode> children) {
        List<TreeNode> result = new ArrayList<TreeNode>();

        for (TreeNode child : children.values()) {
            if (!child.getChildren().isEmpty()) {
                result.add(child);
            }
        }

        return result;
    }

    private List<TreeNode> getChildrenLeaves(Map<String, TreeNode> children) {
        List<TreeNode> result = new ArrayList<TreeNode>();

        for (TreeNode child : children.values()) {
            if (child.getChildren().isEmpty()) {
                result.add(child);
            }
        }

        return result;
    }

}
