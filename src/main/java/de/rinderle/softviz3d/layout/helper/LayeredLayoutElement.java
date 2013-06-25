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

public class LayeredLayoutElement {

  public enum Type {
    NODE, LEAF
  }

  private Type type;

  private Integer id;

  private String name;

  private Double width;
  private Double height;
  private Double buildingHeight;

  private String displayName;

  public LayeredLayoutElement(Type type, Integer id, String name, Double width, Double height, Double buildingHeight, String displayName) {
    super();
    this.type = type;
    this.id = id;
    this.name = name;
    this.width = width;
    this.height = height;
    this.buildingHeight = buildingHeight;
    this.displayName = displayName;
  }

  public Type getElementType() {
    return this.type;
  }

  public Integer getId() {
    return id;
  }

  public String getName() {
    return this.name;
  }

  public Double getWidth() {
    return width;
  }

  public Double getHeight() {
    return height;
  }

  public String getBuildingHeight() {
    return "x" + buildingHeight.toString();
  }

  @Override
  public String toString() {
    return "InputElement [type=" + type + ", identifier=" + name
      + ", id=" + id + ", width=" + width
      + ", height=" + height + "]";
  }

  public String getDisplayName() {
    return displayName;
  }

}
