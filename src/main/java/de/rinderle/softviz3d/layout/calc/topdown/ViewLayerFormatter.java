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
package de.rinderle.softviz3d.layout.calc.topdown;

import att.grappa.Graph;
import de.rinderle.softviz3d.layout.helper.HexaColor;

public class ViewLayerFormatter implements LayerFormatter {

    @Override
    public Graph format(Graph graph, Integer depth) {
        return this.adjustGraph(graph, depth);
    }

    private Graph adjustGraph(Graph graph, Integer depth) {
        double transparency = 0.0;

        // calc color
        int colorCalc = depth * 16;
        if (colorCalc > 154 || colorCalc < 0) {
            colorCalc = 154;
        }

        HexaColor color = new HexaColor(100 + colorCalc, 100 + colorCalc, 100 + colorCalc);
        HexaColor nodesColor = new HexaColor(254, 140, 0);

        graph.setAttribute("color", color);
        graph.setAttribute("nodesColor", nodesColor.getHex());
        graph.setAttribute("transparency", transparency + "");

        return graph;
    }

}
