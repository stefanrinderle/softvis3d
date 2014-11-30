/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.layout.helper;

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
