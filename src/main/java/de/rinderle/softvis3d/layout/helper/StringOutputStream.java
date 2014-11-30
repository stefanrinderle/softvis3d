/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.layout.helper;

import java.io.IOException;
import java.io.OutputStream;

public class StringOutputStream extends OutputStream {
  private StringBuilder string = new StringBuilder();

  @Override
  public void write(final int b) throws IOException {
    this.string.append((char) b);
  }

  @Override
  public String toString() {
    return this.string.toString();
  }
}
