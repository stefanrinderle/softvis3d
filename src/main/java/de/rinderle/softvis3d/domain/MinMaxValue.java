/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.domain;

public class MinMaxValue {

	private final Double minValue;
	private final Double maxValue;

	public MinMaxValue(final Double minValue, final Double maxValue) {
		super();
		this.minValue = minValue;
		this.maxValue = maxValue;
	}

	public Double getMinValue() {
		return this.minValue;
	}

	public Double getMaxValue() {
		return this.maxValue;
	}

	@Override
	public String toString() {
		return "MinMaxValue{" + "minValue=" + minValue + ", maxValue="
				+ maxValue + '}';
	}
}
