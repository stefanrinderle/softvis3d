/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.domain.sonar;

public class ModuleInfo {

  private Integer id;
  private String name;

  public ModuleInfo(Integer id, String name) {
    this.id = id;
    this.name = name;
  }

  public Integer getId() {
    return id;
  }

  public String getName() {
    return name;
  }
}
