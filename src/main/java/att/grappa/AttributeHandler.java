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
 * An interface for methods that perform attribute value conversions.
 *
 * @version 1.2, ; Copyright 1996 - 2010 by AT&T Corp.
 * @author  <a href="mailto:john@research.att.com">John Mocenigo</a>, <a href="http://www.research.att.com">Research @ AT&T Labs</a>
 */
public interface AttributeHandler
{
    /**
     * Convert the supplied value to a string. How to convert the value is
     * based on the type, name and attrtype information supplied. Note: this
     * method really could be declared static except that it hides the
     * instance method declared in the AttributeHandler interface and a
     * class method cannot hide an instance method.
     *
     * @param elemType the element type to which the named attribute applies
     * @param name the name of the attribute
     * @param value the object value to be converted to a string
     * @param convType the object-to-string conversion type of the value object
     * @return a string representation of the supplied value
     */
    public String convertValue(int elemType, String name, Object value, int convType);

    /**
     * Convert the supplied string value to the appropriate Object.
     * How to convert the value is
     * based on the type, name and attrtype information supplied. Note: this
     * method really could be declared static except that it hides the
     * instance method declared in the AttributeHandler interface and a
     * class method cannot hide an instance method.
     *
     * @param elemType the element type to which the named attribute applies
     * @param name the name of the attribute
     * @param value the string value to be converted to an object
     * @param convType the string-to-object conversion type of the value object
     * @return an object representation of the supplied value
     */
    public Object convertStringValue(int elemType, String name, String stringValue, int convType);

    /**
     * Make a copy of the supplied value. How to copy the value is
     * based on the type, name and attrtype information supplied. Note: this
     * method really could be declared static except that it hides the
     * instance method declared in the AttributeHandler interface and a
     * class method cannot hide an instance method.
     *
     * @param elemType the element type to which the named attribute applies
     * @param name the name of the attribute
     * @param value the attribute value to be copied
     * @param convType the conversion type of the value object
     * @return a copy of the supplied value
     */
    public Object copyValue(int elemType, String name, Object value, int convType);
}
