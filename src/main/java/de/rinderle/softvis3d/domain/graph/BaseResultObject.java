/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.domain.graph;

import de.rinderle.softvis3d.layout.helper.HexaColor;

public abstract class BaseResultObject {

	private double opacity;
	private int height3d;
	private HexaColor color;

	public void setOpacity(double opacity) {
		this.opacity = opacity;
	}

	public double getOpacity() {
		return opacity;
	}

	/**
	 * String name for y axis in 3d.
	 *
	 * I(y) I I ---------- (x) / / (z)
	 */
	public void setHeight3d(int height3d) {
		this.height3d = height3d;
	}

	/**
	 * called from view.
	 */
	public int getHeight3d() {
		return height3d;
	}

	public void setColor(final HexaColor color) {
		this.color = color;
	}

	/**
	 * Used in view.
	 */
	public HexaColor getColor() {
		return color;
	}

	protected double roundTo2Decimals(final double value) {
		return Math.round(value * 100.0) / 100.0;
	}

}
