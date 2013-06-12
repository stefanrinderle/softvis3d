/*
 *  This software may only be used by you under license from AT&T Corp.
 *  ("AT&T").  A copy of AT&T's Source Code Agreement is available at
 *  AT&T's Internet website having the URL:
 *  <http://www.research.att.com/sw/tools/graphviz/license/source.html>
 *  If you received this software without first entering into a license
 *  with AT&T, you have an infringing copy of this software and cannot use
 *  it without violating AT&T's intellectual property rights.
 */

package att.grappa;

/**
 * This class extends java.awt.geom.Point2D.Double and provides built-in
 * string-to-Point2D and Point2D-to-string conversions suitable for Grappa.
 *
 * @version 1.2, ; Copyright 1996 - 2010 by AT&T Corp.
 * @author  <a href="mailto:john@research.att.com">John Mocenigo</a>, <a href="http://www.research.att.com">Research @ AT&T Labs</a>
 */
public class GrappaPoint extends java.awt.geom.Point2D.Double
{
    /**
     * Constructs and initializes a <code>GrappaPoint</code> with
     * coordinates (0,&nbsp;0).
     */
    public GrappaPoint() {
    }

    /**
     * Constructs and initializes a <code>GrappaPoint</code> with the
     * specified coordinates.
     * @param x,&nbsp;y the coordinates to which to set the newly
     * constructed <code>GrappaPoint</code>
     */
    public GrappaPoint(double x, double y) {
    	this.x = x;
    	this.y = y;
    }

    /**
     * Constructs and initializes a <code>GrappaPoint</code> with the
     * coordinates derived from the specified String representation.
     * The String format should be: "<I>x-coord</I>,<I>y-coord</I>"
     * @param coordString String representing the coordinates to which to
     * set the newly constructed <code>GrappaPoint</code>
     */
    public GrappaPoint(String coordString) {
    	try {
    		int sepIdx = coordString.indexOf(',');
    		if( sepIdx < 0 ) {
    			sepIdx = coordString.indexOf(' ');
    			if( sepIdx < 0 ) {
    				sepIdx = coordString.indexOf('\t') ;
    				if( sepIdx < 0 ) {
    					this.x = java.lang.Double.MIN_VALUE;
    				}
    			}
    		}
    		if( this.x != java.lang.Double.MIN_VALUE ) {
    			this.x = java.lang.Double.valueOf(coordString.substring(0,sepIdx));
    			this.y = java.lang.Double.valueOf(coordString.substring(sepIdx+1));
    		}
    	} catch(NumberFormatException nfe) {
    		throw new IllegalArgumentException("coordinate string (" + coordString + ") has a bad number format (" + nfe.getMessage() + ")");
    	}
    	if(this.x == java.lang.Double.MIN_VALUE) {
    		throw new IllegalArgumentException("coordinate string (" + coordString + ") does not contain 2 valid coordinates");
    	}
    	if( Grappa.negateStringYCoord ) {
    		this.y = -this.y;
    	}
    }

    /**
     * Provides a string representation of this object consistent 
     * with Grappa attributes.
     *
     * @return attribute-suitable string representation of this GrappaPoint.
     */
    public String toAttributeString() {
	return(toFormattedString("%p"));
    }

    /**
     * Provides a formatted string representation of this object.
     * 
     * @param format the format used to build the string (<TT>%p</TT> is the base directive for a GrappaPoint).
     * @return a string representation of this GrappaPoint. 
     */
    public String toFormattedString(String format) {
	return(GrappaSupportPrintf.sprintf(new Object[] { format, this }));
    }

    /**
     * Provides a generic string representation of this object.
     * 
     * @return a generic string representation of this GrappaPoint. 
     */
    public String toString() {
	return(x+","+y);
    }
}
