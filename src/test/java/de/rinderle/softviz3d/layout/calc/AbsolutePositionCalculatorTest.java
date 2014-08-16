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
package de.rinderle.softviz3d.layout.calc;

import att.grappa.Node;

import att.grappa.GrappaBox;
import de.rinderle.softviz3d.TestSource;
import de.rinderle.softviz3d.layout.interfaces.SourceObject;
import att.grappa.Graph;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import de.rinderle.softviz3d.layout.calc.AbsolutePositionCalculator;
import org.junit.Before;
import org.junit.Test;
import static org.junit.Assert.*;

public class AbsolutePositionCalculatorTest {

  @Before
  public void setUp() throws Exception {
  }

  @Test
  public void testAbsolutePositionCalculator() {
    Map<Integer, Graph> inputGraphList = new HashMap<Integer, Graph>();
    
    inputGraphList.put(1, graphRoot());
    inputGraphList.put(2, graphLeaf1());
    inputGraphList.put(3, graphLeaf2());
    
    AbsolutePositionCalculator calculator = new AbsolutePositionCalculator(inputGraphList);
    
    SourceObject source = testSource();
    calculator.calculate(source);
    
    Graph test1 = inputGraphList.get(1);
    Graph test2 = inputGraphList.get(2);
    Graph test3 = inputGraphList.get(3);
    
    System.out.println(test1.getAttributeValue("bb"));
    System.out.println(test2.getAttributeValue("bb"));
    System.out.println(test3.getAttributeValue("bb"));
    
    System.out.println(test1.getAttributeValue("pos"));
    System.out.println(test2.getAttributeValue("pos"));
    System.out.println(test3.getAttributeValue("pos"));
    
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
  
  private SourceObject testSource() {
//    TestSource leaf4 = new TestSource(4, 2, false, null);
//    TestSource leaf5 = new TestSource(5, 2, false, null);
//    List<TestSource> children3 = new ArrayList<TestSource>();
//    children3.add(leaf4);
//    children3.add(leaf5);
//    TestSource node3 = new TestSource(3, 1, true, children3);
    
    // das ist gedreht. Stimm das?
    TestSource leaf1 = new TestSource(3, 1, true, new ArrayList<TestSource>());
    TestSource leaf2 = new TestSource(2, 1, false, new ArrayList<TestSource>());

    List<TestSource> children1 = new ArrayList<TestSource>(); 
    children1.add(leaf1);
    children1.add(leaf2);
    
    TestSource root = new TestSource(1, 0, true, children1);
    return root;
  }

}
