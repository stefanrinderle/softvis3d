/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.domain;

public enum LayoutViewType {
  CITY, DEPENDENCY;

  // TODO: make this nicer
  public static LayoutViewType valueOfRequest(String requestValue) {
    final LayoutViewType result;
    if ("city".equals(requestValue)) {
      result = LayoutViewType.CITY;
    } else {
      result = LayoutViewType.DEPENDENCY;
    }

    return result;
  }
}
