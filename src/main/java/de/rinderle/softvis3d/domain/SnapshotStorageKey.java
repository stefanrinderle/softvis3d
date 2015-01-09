/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.domain;

public class SnapshotStorageKey {

	private String key;

	public SnapshotStorageKey(final VisualizationRequest requestDTO) {
		this.key = requestDTO.getRootSnapshotId() + "_"
				+ requestDTO.getViewType().name() + "_"
				+ requestDTO.getFootprintMetricId() + "_"
				+ requestDTO.getHeightMetricId();
	}

	public String getString() {
		return this.key;
	}
}
