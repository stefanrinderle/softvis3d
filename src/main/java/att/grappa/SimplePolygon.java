/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package att.grappa;

import java.awt.Color;
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
