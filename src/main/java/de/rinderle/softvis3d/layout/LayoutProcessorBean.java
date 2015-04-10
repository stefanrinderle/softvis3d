/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.layout;

import com.google.inject.Inject;
import de.rinderle.softvis3d.domain.SnapshotTreeResult;
import de.rinderle.softvis3d.domain.VisualizationRequest;
import de.rinderle.softvis3d.domain.graph.ResultPlatform;
import de.rinderle.softvis3d.guice.SnapshotVisitorFactory;
import de.rinderle.softvis3d.layout.bottomUp.BottomUpLayout;
import de.rinderle.softvis3d.layout.bottomUp.SnapshotVisitor;
import de.rinderle.softvis3d.layout.dot.DotExecutorException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sonar.api.config.Settings;

import java.util.Map;

public class LayoutProcessorBean implements LayoutProcessor {

    private static final Logger LOGGER = LoggerFactory.getLogger(LayoutProcessorBean.class);
    @Inject
    private SnapshotVisitorFactory visitorFactory;
    @Inject
    private BottomUpLayout bottomUpLayout;

    @Override
    public Map<Integer, ResultPlatform> process(Settings settings, VisualizationRequest requestDTO,
            SnapshotTreeResult snapshotTreeResult) throws DotExecutorException {

        final SnapshotVisitor visitor = this.visitorFactory.create(settings, requestDTO);

        this.bottomUpLayout.accept(visitor, snapshotTreeResult);

        return visitor.getResultingGraphList();
    }
}
