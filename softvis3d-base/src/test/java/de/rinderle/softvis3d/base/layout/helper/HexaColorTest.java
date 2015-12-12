/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
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
package de.rinderle.softvis3d.base.layout.helper;

import org.junit.Test;

import static org.junit.Assert.assertEquals;

/**
 * Created by stefan on 31.05.15.
 */
public class HexaColorTest {

  @Test
  public void testCreateColorRgbMax() throws Exception {
    final HexaColor color = new HexaColor(255, 254, 253);

    assertEquals(255, color.getRed());
    assertEquals(254, color.getGreen());
    assertEquals(253, color.getBlue());
  }

  @Test
  public void testCreateColorRgbMin() throws Exception {
    final HexaColor color = new HexaColor(0, 1, 2);

    assertEquals(0, color.getRed());
    assertEquals(1, color.getGreen());
    assertEquals(2, color.getBlue());
  }

  @Test(expected = IllegalArgumentException.class)
  public void testCreateColorIllegalMin() throws Exception {
    new HexaColor(0, -1, 2);
  }

  @Test
  public void testGetHexMin() throws Exception {
    final HexaColor color = new HexaColor(0, 1, 2);
    final String hex = color.getHex();

    assertEquals("#001020", hex);
  }

  @Test
  public void testGetHexMax() throws Exception {
    final HexaColor color = new HexaColor(255, 254, 253);
    final String hex = color.getHex();

    assertEquals("#FFFEFD", hex);
  }

  @Test
  public void testGetHexMiddle() throws Exception {
    final HexaColor color = new HexaColor(100, 200, 90);
    final String hex = color.getHex();

    assertEquals("#64C85A", hex);
  }

  @Test
  public void testFromHexMin() throws Exception {
    final HexaColor color = HexaColor.createHexaColorFromHex("#000000");
    final String hex = color.getHex();

    assertEquals("#000000", hex);
  }

  @Test
  public void testFromHexMax() throws Exception {
    final HexaColor color = HexaColor.createHexaColorFromHex("#ffFFff");
    final String hex = color.getHex();

    assertEquals("#FFFFFF", hex);
  }

  @Test
  public void testFromHexMiddle() throws Exception {
    final HexaColor color = HexaColor.createHexaColorFromHex("#64C85A");
    final String hex = color.getHex();

    assertEquals("#64C85A", hex);
  }

}
