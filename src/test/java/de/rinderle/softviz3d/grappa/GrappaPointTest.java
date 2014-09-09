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
package de.rinderle.softviz3d.grappa;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

import att.grappa.GrappaPoint;

public class GrappaPointTest {

    @Test
    public void test() {
        GrappaPoint pos = new GrappaPoint(-7, -9);
        
        assertTrue(-7 == pos.getX());
        assertTrue(-9 == pos.getY());
        
        assertTrue(-7 == pos.x);
        assertTrue(-9 == pos.y);
    }

    @Test
    public void testSplit() {
        GrappaPoint pos = new GrappaPoint(-7, -9);
        
        String attributeString = pos.toAttributeString();
        
        String[] attributePos = attributeString.split(",");
        
        assertEquals("-7", attributePos[0]);
        assertEquals("9", attributePos[1]);
        
        assertTrue(-7 == pos.x);
        assertTrue(-9 == pos.y);
    }
    
    @Test
    public void testStringConversion() {
        GrappaPoint pos = new GrappaPoint("48,-12");
        
        assertTrue(48 == pos.x);
        assertTrue(12 == pos.y);
    }
    
}
