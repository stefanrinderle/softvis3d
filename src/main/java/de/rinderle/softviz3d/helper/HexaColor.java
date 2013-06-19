/*
 * SoftViz3d Sonar plugin
 * Copyright (C) 2013 Stefan Rinderle
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
package de.rinderle.softviz3d.helper;

import java.awt.Color;

public class HexaColor extends Color {

  public HexaColor(int r, int g, int b) {
    super(r, g, b);
  }

  /**
   * Returns the HEX value representing the colour in the default sRGB ColorModel.
   *
   * @return the HEX value of the colour in the default sRGB ColorModel
   */
  public String getHex() {
    return toHex(getRed(), getGreen(), getBlue());
  }

  /**
   * Returns a web browser-friendly HEX value representing the colour in the default sRGB
   * ColorModel.
   *
   * @param r red
   * @param g green
   * @param b blue
   * @return a browser-friendly HEX value
   */
  public static String toHex(int r, int g, int b) {
    return "0x" + toBrowserHexValue(r) + toBrowserHexValue(g) + toBrowserHexValue(b);
  }

  private static String toBrowserHexValue(int number) {
    StringBuilder builder = new StringBuilder(Integer.toHexString(number & 0xff));
    while (builder.length() < 2) {
      builder.append("0");
    }
    return builder.toString().toUpperCase();
  }

}
