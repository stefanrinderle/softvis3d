/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.guice;

import com.google.inject.assistedinject.Assisted;
import de.rinderle.softvis3d.domain.VisualizationRequest;
import de.rinderle.softvis3d.layout.bottomUp.SnapshotVisitor;
import org.sonar.api.config.Settings;

public interface SnapshotVisitorFactory {
    public SnapshotVisitor create(@Assisted Settings settings, @Assisted VisualizationRequest requestDTO);
}
