/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.domain.sonar;

import java.math.BigDecimal;

public class SonarSnapshotBuilder {

	int id;
  String path;
  double footprintMetricValue;
  double heightMetricValue;
  public int authorCount;

  public SonarSnapshotBuilder(int id, String path) {
		this.id = id;
		this.path = path;
	}

	public SonarSnapshotBuilder footprintMetricValue(BigDecimal footprintMetricValue) {
    if (footprintMetricValue == null) {
      this.footprintMetricValue = BigDecimal.ZERO.doubleValue();
    } else {
      this.footprintMetricValue = footprintMetricValue.doubleValue();
    }

		return this;
	}

	public SonarSnapshotBuilder heightMetricValue(BigDecimal heightMetricValue) {
    if (heightMetricValue == null) {
      this.footprintMetricValue = BigDecimal.ZERO.doubleValue();
    } else {
      this.heightMetricValue = heightMetricValue.doubleValue();
    }

		return this;
	}

  public SonarSnapshotBuilder differentAuthors(int differentAuthors) {
    this.authorCount = differentAuthors;

    return this;
  }

	public SonarSnapshot build() {
		return new SonarSnapshot(this);
	}

}