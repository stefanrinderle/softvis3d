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
import de.rinderle.softviz3d.layout.calc.LayoutViewType;
import de.rinderle.softviz3d.sonar.SonarDao;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Singleton
public class ResourceTreeServiceImpl implements ResourceTreeService {
    private static final Logger LOGGER = LoggerFactory.getLogger(ResourceTreeServiceImpl.class);

    private Map<String, PathWalker> loadedPathWalkers = new ConcurrentHashMap<String, PathWalker>();

    @Inject
    private SonarDao sonarDao;

    @Override
    public TreeNode createTreeStructure(final LayoutViewType type, int rootSnapshotId, int heightMetric, int footprintMetric) {
        LOGGER.info("loadedPathWalkers size " + loadedPathWalkers.size());

        if (!loadedPathWalkers.containsKey(getId(type, rootSnapshotId))) {
            LOGGER.info("Created tree structure for id " + rootSnapshotId);
            PathWalker pathWalker = new PathWalker(rootSnapshotId);

            List<Object[]> flatChildren = sonarDao.getAllProjectElements(rootSnapshotId, heightMetric, footprintMetric);

            //s.id, p.name, m1.value, m2.value
            for (Object[] flatChild : flatChildren) {
                int snapshotId = (Integer) flatChild[0];
                String name = (String) flatChild[1];
                BigDecimal footprintMetricValue = (BigDecimal) flatChild[2];
                BigDecimal heightMetricValue = (BigDecimal) flatChild[3];

                pathWalker.addPath(snapshotId, name, footprintMetricValue.doubleValue(), heightMetricValue.doubleValue());
            }

            TreeNormalizer normalizer = new TreeNormalizer();
            normalizer.normalizeTree(pathWalker.getTree());
            normalizer.recalculateDepth(pathWalker.getTree());

            loadedPathWalkers.put(getId(type, rootSnapshotId), pathWalker);
        }

        return loadedPathWalkers.get(getId(type, rootSnapshotId)).getTree();
    }

    private String getId(LayoutViewType type, int rootSnapshotId) {
        return rootSnapshotId + "_" + type.name();
    }

    @Override
    public List<TreeNode> getChildrenNodeIds(final LayoutViewType type, Integer rootSnapshotId, Integer id) {
        PathWalker pathWalker = loadedPathWalkers.get(getId(type, rootSnapshotId));

        TreeNode treeNode = recursiveSearch(id, pathWalker.getTree());

        return getChildrenNodes(treeNode.getChildren());
    }

    @Override
    public List<TreeNode> getChildrenLeafIds(final LayoutViewType type, Integer rootSnapshotId, Integer id) {
        PathWalker pathWalker = loadedPathWalkers.get(getId(type, rootSnapshotId));

        TreeNode treeNode = recursiveSearch(id, pathWalker.getTree());

        return getChildrenLeaves(treeNode.getChildren());
    }

    @Override
    public TreeNode findNode(final LayoutViewType type, final Integer rootSnapshotId, final Integer id) {
        PathWalker pathWalker = loadedPathWalkers.get(getId(type, rootSnapshotId));

        return recursiveSearch(id, pathWalker.getTree());
    }

    @Override
    public Integer addInterfaceLeafNode(final LayoutViewType type, final Integer rootSnapshotId, final String intLeafLabel, final Integer parentId) {
        PathWalker pathWalker = loadedPathWalkers.get(getId(type, rootSnapshotId));

        // search for parent node
        TreeNode parent = recursiveSearch(parentId, pathWalker.getTree());

        Integer id = pathWalker.getNextSequence();
        final TreeNode interfaceLeafTreeNode = new TreeNode(id, parent, parent.getDepth() + 1, TreeNodeType.DEPENDENCY_GENERATED, "elevatorNode_" + id, 0, 0);
        parent.getChildren().put(intLeafLabel, interfaceLeafTreeNode);

        return interfaceLeafTreeNode.getId();
    }

    @Override
    public TreeNode findInterfaceLeafNode(final LayoutViewType type, final Integer rootSnapshotId, final String intLeafLabel) {
        PathWalker pathWalker = loadedPathWalkers.get(getId(type, rootSnapshotId));
        return recursiveSearch(intLeafLabel, pathWalker.getTree());
    }

    @Override
    public DependencyType getDependencyType(final LayoutViewType type, final Integer rootSnapshotId, final Integer fromSnapshotId, final Integer toSnapshotId) {
        TreeNode from = findNode(type, rootSnapshotId, fromSnapshotId);
        TreeNode to = findNode(type, rootSnapshotId, toSnapshotId);

        // TODO check this - why is this needed.
        boolean hasSameParent = true;
        if (from != null && to != null) {
            hasSameParent = from.getParent().getId().equals(to.getParent().getId());
        }

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
        if (treeNode.getId().equals(id)) {
            /**
             * check if there is a child treeNode with the same id.
             * This is to parse long paths and get the last treeNode
             * of the chain with the same id.
             */
            for (TreeNode child : treeNode.getChildren().values()) {
                if (child.getId().equals(id)) {
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
