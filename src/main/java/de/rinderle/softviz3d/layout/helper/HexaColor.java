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
package de.rinderle.softviz3d.layout.helper;

import java.awt.*;

public class HexaColor extends Color {

  private static final long serialVersionUID = 6814600514228717253L;

  public HexaColor(final int r, final int g, final int b) {
    super(r, g, b);
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
  public static String toHex(final int r, final int g, final int b) {
    return "0x" + toBrowserHexValue(r) + toBrowserHexValue(g) + toBrowserHexValue(b);
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
