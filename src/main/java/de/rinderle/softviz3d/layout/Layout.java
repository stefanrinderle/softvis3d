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
package de.rinderle.softviz3d.layout;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import att.grappa.Graph;
import de.rinderle.softviz3d.depth.ResourceTreeService;
import de.rinderle.softviz3d.layout.calc.AbsolutePositionCalculator;
import de.rinderle.softviz3d.layout.calc.LayeredLayoutElement;
import de.rinderle.softviz3d.layout.calc.LayoutVisitor;
import de.rinderle.softviz3d.layout.dot.DotExcecutorException;
import de.rinderle.softviz3d.layout.interfaces.SourceObject;

public class Layout {

    private LayoutVisitor visitor;

    private ResourceTreeService resourceTreeService;
    
    public Layout(LayoutVisitor visitor, ResourceTreeService resourceTreeService) {
        this.visitor = visitor;
        this.resourceTreeService = resourceTreeService;
    }

    public Map<Integer, Graph> startLayout(SourceObject source)
            throws DotExcecutorException {
        // STEP 1 ---

        // last output element could be used to start absolutepositioncalc
        this.accept(source);
        Map<Integer, Graph> resultGraphs = this.visitor.getResultingGraphList();
        // ----------

        startAbsolutePositioning(source, resultGraphs);

        return resultGraphs;
    }

    private Map<Integer, Graph> startAbsolutePositioning(SourceObject source,
            Map<Integer, Graph> resultGraphs) {
        // NEXT STEP HERE
        AbsolutePositionCalculator calc = new AbsolutePositionCalculator(
                resultGraphs, resourceTreeService);
        calc.calculate(source);
        // ---

        return resultGraphs;
    }

    /**
     * Bottom up calculation of layout layers.
     * 
     * Public because of unit testing access.
     */
    public LayeredLayoutElement accept(SourceObject source)
            throws DotExcecutorException {
        List<LayeredLayoutElement> layerElements = new ArrayList<LayeredLayoutElement>();

        List<Integer> childrenNodeIds = resourceTreeService.getChildrenNodeIds(source.getId());

//        System.out.println("-------------------------------------");
//        System.out.println(source.getId() + " " + source.getName());
//        System.out.println("------------------------------------childs-");
        
//        for (Integer integer : childrenNodeIds) {
//            System.out.println(integer);
//        }
//        System.out.println("------------------------------------childs-");
//        System.out.println("-------------------------------------");
        
        List<? extends SourceObject> childrenNodesTest;
        if (childrenNodeIds.isEmpty()) {
            childrenNodesTest = new ArrayList<SourceObject>();
        } else {
            childrenNodesTest = source.getSnapshotsByIds(childrenNodeIds);
        }
        
//        List<? extends SourceObject> childrenNodes = source.getChildrenNodes();
        List<? extends SourceObject> childrenNodes = childrenNodesTest;
        
        for (SourceObject node : childrenNodes) {
            layerElements.add(this.accept(node));
        }

        List<Integer> childrenLeafIds = resourceTreeService.getChildrenLeafIds(source.getId());

        List<? extends SourceObject> childrenLeafTest;
        if (childrenLeafIds.isEmpty()) {
            childrenLeafTest = new ArrayList<SourceObject>();
        } else {
            childrenLeafTest = source.getSnapshotsByIds(childrenLeafIds);
        }

        List<? extends SourceObject> childrenLeaves = childrenLeafTest;
                
//        List<? extends SourceObject> childrenLeaves = source
//                .getChildrenLeaves();
        
        for (SourceObject leaf : childrenLeaves) {
            layerElements.add(visitor.visitFile(leaf));
        }

        LayeredLayoutElement layer = visitor.visitNode(source, layerElements);

        return layer;
    }

}
