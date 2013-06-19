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

import java.awt.geom.AffineTransform;
import java.awt.geom.PathIterator;

/**
 * This class provides a PathIterator for GrappaNexus shapes.
 *
 * @version 1.2, ; Copyright 1996 - 2010 by AT&T Corp.
 * @author  <a href="mailto:john@research.att.com">John Mocenigo</a>, <a href="http://www.research.att.com">Research @ AT&T Labs</a>
 */
public class GrappaPathIterator implements PathIterator
{
    GrappaNexus grappaNexus;
    AffineTransform affine;
    PathIterator shapeIterator = null;
    PathIterator areaIterator = null;
    double[] pts = new double[6];
    int type;

    ////////////////////////////////////////////////////////////////////////
    //
    // Constructors
    //
    ////////////////////////////////////////////////////////////////////////

    /**
     * Constructs a new <code>GrappaPathIterator</code> given a GrappaNexus.
     */
    public GrappaPathIterator(GrappaNexus shape) {
	this(shape, null);
    }

    /**
     * Constructs a new <code>GrappaPathIterator</code> given a GrappaNexus
     * and an optional AffineTransform.
     */
    public GrappaPathIterator(GrappaNexus shape, AffineTransform at) {
    	if(shape == null) {
    		throw new IllegalArgumentException("shape cannot be null");
    	}
    	this.grappaNexus = shape;
    	this.affine = at;
    	if(shape.shape != null) {
    		shapeIterator = shape.shape.getPathIterator(this.affine);
    		if(shapeIterator.isDone()) {
    			shapeIterator = null;
    		}
    	}
    	if(shape.textArea != null && (Grappa.shapeClearText || shape.clearText)) {
    		areaIterator = shape.textArea.getPathIterator(this.affine);
    		if(areaIterator.isDone()) {
    			areaIterator = null;
    		}
    	}
    	if(shapeIterator != null) {
    		type = shapeIterator.currentSegment(pts);
    	} else if(areaIterator != null) {
    		type = areaIterator.currentSegment(pts);
    	} else {
    		throw new RuntimeException("cannot initialize; nothing to iterate over");
    	}
    }

    ////////////////////////////////////////////////////////////////////////
    //
    // PathIterator interface
    //
    ////////////////////////////////////////////////////////////////////////

    public int currentSegment(double[] coords) {
    	System.arraycopy(pts, 0, coords, 0, 6);
    	return(type);
    }

    public int currentSegment(float[] coords) {
    	coords[0] = (float)pts[0];
    	coords[1] = (float)pts[1];
    	coords[2] = (float)pts[2];
    	coords[3] = (float)pts[3];
    	coords[4] = (float)pts[4];
    	coords[5] = (float)pts[5];
    	return(type);
    }

    /**
     * Return the winding rule for determining the interior of the path.
     */
    public int getWindingRule() {
	return(grappaNexus.getWindingRule());
    }

    public boolean isDone() {
	return(
	       (shapeIterator == null || shapeIterator.isDone())
	       &&
	       (areaIterator == null || areaIterator.isDone())
	       );
    }

    public void next() {
    	if(shapeIterator != null) {
    		if(shapeIterator.isDone()) {
    			shapeIterator = null;
    		} else {
    			shapeIterator.next();
    			if(shapeIterator.isDone()) {
    				shapeIterator = null;
    			} else {
    				type = shapeIterator.currentSegment(pts);
    			}
    			return;
    		}
    	}
    	if(areaIterator != null) {
    		if(areaIterator.isDone()) {
    			areaIterator = null;
    		} else {
    			areaIterator.next();
    			if(areaIterator.isDone()) {
    				areaIterator = null;
    			} else {
    				type = areaIterator.currentSegment(pts);
    			}
    			return;
    		}
    	}
    }

}
