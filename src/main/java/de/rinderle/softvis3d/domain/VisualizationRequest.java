/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.domain;

public class VisualizationRequest {

	private final int rootSnapshotId;

	private final LayoutViewType viewType;

	private final int footprintMetricId;
	private final int heightMetricId;

	public VisualizationRequest(int rootSnapshotId, LayoutViewType viewType,
			int footprintMetricId, int heightMetricId) {
		this.rootSnapshotId = rootSnapshotId;

		this.viewType = viewType;

		this.footprintMetricId = footprintMetricId;
		this.heightMetricId = heightMetricId;
	}

	public int getRootSnapshotId() {
		return this.rootSnapshotId;
	}

	public LayoutViewType getViewType() {
		return this.viewType;
	}

	public int getFootprintMetricId() {
		return this.footprintMetricId;
	}

	public int getHeightMetricId() {
		return this.heightMetricId;
	}
}
