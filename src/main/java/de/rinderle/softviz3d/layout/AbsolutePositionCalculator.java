/*
 * SoftViz3d Sonar plugin
 * Copyright (C) 2013 Rinderle
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
package de.rinderle.softviz3d.layout;

import att.grappa.Graph;
import att.grappa.GrappaBox;
import att.grappa.Node;
import de.rinderle.softviz3d.helper.Point3d;
import de.rinderle.softviz3d.layout.model.SourceObject;

import java.util.HashMap;
import java.util.Map;

public class AbsolutePositionCalculator {

  // private static final Logger LOGGER = LoggerFactory
  // .getLogger(AbsolutePositionCalculator.class);

  private Map<Integer, Graph> inputGraphs;

  private Map<Integer, Point3d> innerGraphTranslation;

  public AbsolutePositionCalculator(Map<Integer, Graph> inputGraphList) {
    this.inputGraphs = inputGraphList;

    this.innerGraphTranslation = new HashMap<Integer, Point3d>();
  }

  public void calculate(SourceObject source) {
    this.addTranslationToLayer(source, new Point3d(0, 0, 0));
  }

  private void addTranslationToLayer(SourceObject source, Point3d point3dTranslation) {
    // inputGraphs --> Map<Integer, Graph>
    // Step 1 - search the graph for the source given
    Graph graph = inputGraphs.get(source.getIdentifier());
    GrappaBox bb = (GrappaBox) graph.getAttributeValue("bb");

    // Step 2 - set translation for the graph itself (will be a layer later)
    graph.setAttribute("pos3d", point3dTranslation.toString());

    // Step 3 - for all leaves, just add the parent point3d changes
    for (Node leaf : graph.nodeElementsAsArray()) {
      Point3d pos3d = new Point3d(leaf.getAttributeValue("pos3d").toString());

      pos3d.setX(pos3d.getX());
      pos3d.setY(point3dTranslation.getY());
      pos3d.setZ(pos3d.getZ());

      innerGraphTranslation.put(Integer.valueOf(leaf.getAttributeValue("id").toString()), pos3d);

      pos3d.setX(point3dTranslation.getX() + pos3d.getX() - bb.getWidth() / 2);
      pos3d.setZ(point3dTranslation.getZ() + pos3d.getZ() + bb.getHeight() / 2);

      leaf.setAttribute("pos3d", pos3d.toString());
    }

    // Step 4 - for all dirs, call this method (recursive) with the parent + the self changes
    for (SourceObject childrenSource : source.getChildrenNodes()) {
      Point3d translation = innerGraphTranslation.get(childrenSource.getIdentifier());
      translation.setY(translation.getY() + 30);

      addTranslationToLayer(childrenSource, translation);

      graph.removeNode("dir_" + childrenSource.getIdentifier().toString());
    }

  }

}
