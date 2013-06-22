/*
 * SoftViz3d Sonar plugin
 * Copyright (C) 2013 Stefan Rinderle
 * dev@sonar.codehaus.org
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
package de.rinderle.softviz3d.layout.calc;

import att.grappa.Graph;
import att.grappa.GrappaBox;
import att.grappa.GrappaPoint;
import att.grappa.Node;
import de.rinderle.softviz3d.layout.interfaces.LayoutConstants;
import de.rinderle.softviz3d.layout.interfaces.SourceObject;

import java.util.HashMap;
import java.util.Map;

import static att.grappa.GrappaConstants.POS_ATTR;

public class AbsolutePositionCalculator {

  // private static final Logger LOGGER = LoggerFactory
  // .getLogger(AbsolutePositionCalculator.class);

  private Map<Integer, Graph> inputGraphs;

  private Map<Integer, GrappaPoint> innerGraphTranslation;

  public AbsolutePositionCalculator(Map<Integer, Graph> inputGraphList) {
    this.inputGraphs = inputGraphList;

    this.innerGraphTranslation = new HashMap<Integer, GrappaPoint>();
  }

  public void calculate(SourceObject source) {
    this.addTranslationToLayer(source, new GrappaPoint(0, 0), 0);
  }

  private void addTranslationToLayer(SourceObject source, GrappaPoint posTranslation, Integer height3d) {
    // inputGraphs --> Map<Integer, Graph>
    // Step 1 - search the graph for the source given
    Graph graph = inputGraphs.get(source.getId());
    GrappaBox bb = (GrappaBox) graph.getAttributeValue("bb");

    // Step 2 - set translation for the graph itself (will be a layer later)
    GrappaBox translatedBb = new GrappaBox(posTranslation.getX(), posTranslation.getY(), bb.getWidth(), bb.getHeight());
    graph.setAttribute("bb", translatedBb);
    
    graph.setAttribute(LayoutConstants.LAYER_HEIGHT_3D, height3d.toString());
    
    GrappaPoint pos;
    double nodeLocationX;
    double nodeLocationY;
    
    // Step 3 - for all leaves, just add the parent point3d changes
    for (Node leaf : graph.nodeElementsAsArray()) {
      pos = (GrappaPoint) leaf.getAttributeValue(POS_ATTR);
      
      innerGraphTranslation.put(Integer.valueOf(leaf.getAttributeValue("id").toString()), pos);

      leaf.setAttribute(LayoutConstants.LAYER_HEIGHT_3D, height3d.toString());
      
      nodeLocationX = posTranslation.getX() + pos.getX() - translatedBb.getWidth() / 2;
      nodeLocationY = posTranslation.getY() + pos.getY() + translatedBb.getHeight() / 2;
      pos.setLocation(nodeLocationX, nodeLocationY);
      
      Double width = (Double) leaf.getAttributeValue("width");
      // keep some distance to each other
      width = width * LayoutConstants.DPI_DOT_SCALE;
      leaf.setAttribute("width", width);
      
      //leaf.setAttribute("height", 72);
    }

    // Step 4 - for all dirs, call this method (recursive) with the parent + the self changes
    for (SourceObject childrenSource : source.getChildrenNodes()) {
      pos = innerGraphTranslation.get(childrenSource.getId());
      
      addTranslationToLayer(childrenSource, pos, height3d + 100);

      graph.removeNode("dir_" + childrenSource.getId().toString());
    }

  }

}
