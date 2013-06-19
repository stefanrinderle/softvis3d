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

/**
 * An interface for describing the drawing of custom shapes that cannot
 * be captured via a single GeneralPath. This interface would generally
 * be used when the Attribute SHAPE_ATTR=custom and CUSTOM_ATTR is set to
 * the name of a user provided class which would be an extension of
 * GrappaShape and implements this interface. Note that if the custom shape
 * desired by the user can be expressed as a single general path, then there
 * is no need to use this interface or provide the methods it requires.
 *
 * @version 1.2, ; Copyright 1996 - 2010 by AT&T Corp.
 * @author  <a href="mailto:john@research.att.com">John Mocenigo</a>, <a href="http://www.research.att.com">Research @ AT&T Labs</a>
 */
public interface CustomRenderer
{
    /**
     * The method called when the element needs to be drawn.
     * When used with an extention of <i>GrappaShape</i>,
     * the default behavior is obtained by:
     * <pre>
     * public void draw(java.awt.Graphics2D g2d) {
     *   g2d.draw(this);
     * }
     * </pre>
     *
     * @param g2d the Graphics2D context to be used for drawing
     */
    public void draw(java.awt.Graphics2D g2d);

    /**
     * The method called when the element needs to be filled.
     * When used with an extention of <i>GrappaShape</i>,
     * the default behavior is obtained by:
     * <pre>
     * public void fill(java.awt.Graphics2D g2d) {
     *   g2d.fill(this);
     * }
     * </pre>
     *
     * @param g2d the Graphics2D context to be used for drawing
     */
    public void fill(java.awt.Graphics2D g2d);

    /**
     * The method called when the element needs to draw its background
     * image.
     * When used with an extention of <i>GrappaShape</i> that provides
     * the underlying element as a global variable, the default behavior
     * is obtained by:
     * <pre>
     * public void drawImage(java.awt.Graphics2D g2d) {
     *   Rectangle sbox = this.getBounds();
     *   Shape clip = g2d.getClip();
     *   g2d.clip(this);
     *   g2d.drawImage(element.getGrappaNexus().getImage(), sbox.x, sbox.y, sbox.width, sbox.height, null);
     *   g2d.setClip(clip);
     * }
     * </pre>
     *
     * @param g2d the Graphics2D context to be used for drawing
     */
    public void drawImage(java.awt.Graphics2D g2d);

}
