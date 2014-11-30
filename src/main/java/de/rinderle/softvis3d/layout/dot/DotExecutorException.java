/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.layout.dot;

public class DotExecutorException extends Exception {

  private static final long serialVersionUID = -1130080106752515879L;

  public DotExecutorException(final String message, final Exception e) {
    super(message, e);
  }
}
