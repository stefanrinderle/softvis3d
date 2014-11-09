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
package de.rinderle.softviz3d.guice;

import com.google.inject.AbstractModule;
import com.google.inject.assistedinject.FactoryModuleBuilder;
import de.rinderle.softviz3d.VisualizationProcessor;
import de.rinderle.softviz3d.VisualizationProcessorBean;
import de.rinderle.softviz3d.cache.SnapshotCacheService;
import de.rinderle.softviz3d.cache.SnapshotCacheServiceBean;
import de.rinderle.softviz3d.dao.*;
import de.rinderle.softviz3d.layout.LayoutProcessor;
import de.rinderle.softviz3d.layout.LayoutProcessorBean;
import de.rinderle.softviz3d.layout.bottomUp.BottomUpLayout;
import de.rinderle.softviz3d.layout.bottomUp.BottomUpLayoutBean;
import de.rinderle.softviz3d.layout.bottomUp.SnapshotVisitor;
import de.rinderle.softviz3d.layout.bottomUp.SnapshotVisitorBean;
import de.rinderle.softviz3d.layout.dot.*;
import de.rinderle.softviz3d.layout.format.LayerFormatter;
import de.rinderle.softviz3d.layout.format.LayerFormatterBean;
import de.rinderle.softviz3d.postprocessing.PostProcessor;
import de.rinderle.softviz3d.postprocessing.PostProcessorBean;
import de.rinderle.softviz3d.preprocessing.PreProcessor;
import de.rinderle.softviz3d.preprocessing.PreProcessorBean;
import de.rinderle.softviz3d.preprocessing.dependencies.DependencyExpander;
import de.rinderle.softviz3d.preprocessing.dependencies.DependencyExpanderBean;
import de.rinderle.softviz3d.preprocessing.tree.OptimizeTreeStructure;
import de.rinderle.softviz3d.preprocessing.tree.OptimizeTreeStructureImpl;
import de.rinderle.softviz3d.preprocessing.tree.TreeBuilder;
import de.rinderle.softviz3d.preprocessing.tree.TreeBuilderBean;
import de.rinderle.softviz3d.webservice.TreeNodeJsonWriter;
import de.rinderle.softviz3d.webservice.TreeNodeJsonWriterImpl;
import de.rinderle.softviz3d.webservice.TreeWebserviceHandler;
import de.rinderle.softviz3d.webservice.TreeWebserviceHandlerBean;

public class SoftViz3dModule extends AbstractModule {
  @Override
  protected void configure() {
    this.bind(DotVersion.class).to(DotVersionImpl.class);
    this.bind(DotExecutor.class).to(DotExecutorImpl.class);
    this.bind(ExecuteCommand.class).to(ExecuteCommandImpl.class);

    this.bind(SonarDao.class).to(SonarDaoBean.class);
    this.bind(DependencyDao.class).to(DependencyDaoBean.class);
    this.bind(DaoService.class).to(DaoServiceBean.class);

    this.bind(OptimizeTreeStructure.class).to(OptimizeTreeStructureImpl.class);
    this.bind(SnapshotCacheService.class).to(SnapshotCacheServiceBean.class);
    this.bind(DependencyExpander.class).to(DependencyExpanderBean.class);

    this.bind(VisualizationProcessor.class).to(VisualizationProcessorBean.class);
    this.bind(LayerFormatter.class).to(LayerFormatterBean.class);

    this.bind(PostProcessor.class).to(PostProcessorBean.class);

    this.bind(PreProcessor.class).to(PreProcessorBean.class);
    this.bind(TreeBuilder.class).to(TreeBuilderBean.class);

    this.bind(LayoutProcessor.class).to(LayoutProcessorBean.class);

    this.bind(TreeNodeJsonWriter.class).to(TreeNodeJsonWriterImpl.class);
    this.bind(TreeWebserviceHandler.class).to(TreeWebserviceHandlerBean.class);

    this.install(new FactoryModuleBuilder().implement(SnapshotVisitor.class,
      SnapshotVisitorBean.class).build(SnapshotVisitorFactory.class));

    this.bind(BottomUpLayout.class).to(BottomUpLayoutBean.class);
  }
}
