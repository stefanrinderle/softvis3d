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
package att.grappa;

import java.awt.Color;
//@IgnoreJRERequirement
import java.awt.geom.Path2D.Double;

public class SimplePolygon extends Double {
	Color fillColor;
	Color lineColor;
	
	public void setFillColor( Color fillColor ) {
		this.fillColor = fillColor ;
	}
	
	public Color getFillColor() { return fillColor; }
	
	public void setLineColor( Color lineColor ) {
		this.lineColor = lineColor ;
	}
	
	public Color getLineColor() { return lineColor; }
}
