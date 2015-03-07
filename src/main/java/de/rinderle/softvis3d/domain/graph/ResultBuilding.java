/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.domain.graph;

import att.grappa.*;
import de.rinderle.softvis3d.domain.SoftVis3DConstants;
import de.rinderle.softvis3d.domain.tree.TreeNodeType;
import de.rinderle.softvis3d.layout.helper.HexaColor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;

public class ResultBuilding extends BaseResultObject {

	private int id;

	private final List<ResultArrow> arrows;
	private double buildingHeight;
	private double width;
	private double height;

	private TreeNodeType type;

	private GrappaPoint position;

	public ResultBuilding(final ResultBuildingBuilder resultBuildingBuilder) {
    this.id = resultBuildingBuilder.id;
    this.arrows = resultBuildingBuilder.arrows;
    this.width = resultBuildingBuilder.width;
    this.height = resultBuildingBuilder.height;

    this.setColor(resultBuildingBuilder.color);

		this.buildingHeight = resultBuildingBuilder.buildingHeight;

		this.type = resultBuildingBuilder.type;

		this.position = resultBuildingBuilder.position;
	}

  public int getId() {
		return id;
	}

	public List<ResultArrow> getArrows() {
		return arrows;
	}

	/**
	 * called from view.
	 */
	public double getBuildingHeight() {
		return buildingHeight;
	}

	public void setWidth(double width) {
		this.width = this.roundTo2Decimals(width);
	}

	public double getWidth() {
		return width;
	}

	public void setHeight(double height) {
		this.height = this.roundTo2Decimals(height);
	}

	public double getHeight() {
		return height;
	}

	public TreeNodeType getType() {
		return this.type;
	}

	public GrappaPoint getPosition() {
		return this.position;
	}

  private double roundTo2Decimals(final double value) {
    return Math.round(value * 100.0) / 100.0;
  }

}
