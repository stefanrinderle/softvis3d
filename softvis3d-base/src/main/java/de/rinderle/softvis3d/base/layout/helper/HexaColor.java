/*
 * softvis3d-base
 * Copyright (C) 2015 Stefan Rinderle
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

import java.awt.*;

public class HexaColor extends Color {

  private static final long serialVersionUID = 6814600514228717253L;

  public HexaColor(final int r, final int g, final int b) {
    super(r, g, b);
  }

  public static HexaColor createHexaColorFromHex(final String hexValueString) {
    final String redString = hexValueString.substring(1, 3);
    final String greenString = hexValueString.substring(3, 5);
    final String blueString = hexValueString.substring(5, 7);

    final Integer red = Integer.parseInt(redString, 16);
    final Integer green = Integer.parseInt(greenString, 16);
    final Integer blue = Integer.parseInt(blueString, 16);

    return new HexaColor(red, green, blue);
  }

  /**
   * Returns a web browser-friendly HEX value representing the colour in the default sRGB ColorModel.
   *
   * @param r
   *            red
   * @param g
   *            green
   * @param b
   *            blue
   * @return a browser-friendly HEX value
   */
  private static String toHex(final int r, final int g, final int b) {
    return "#" + toBrowserHexValue(r) + toBrowserHexValue(g) + toBrowserHexValue(b);
  }

  private static String toBrowserHexValue(final int number) {
    final StringBuilder builder = new StringBuilder(Integer.toHexString(number & 0xff));
    while (builder.length() < 2) {
      builder.append("0");
    }
    return builder.toString().toUpperCase();
  }

  /**
   * Returns the HEX value representing the colour in the default sRGB ColorModel.
   *
   * @return the HEX value of the colour in the default sRGB ColorModel
   */
  public String getHex() {
    return toHex(this.getRed(), this.getGreen(), this.getBlue());
  }

}
