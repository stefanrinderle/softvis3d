/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.guice;

import com.google.inject.AbstractModule;
import com.google.inject.assistedinject.FactoryModuleBuilder;
import de.rinderle.softvis3d.VisualizationProcessor;
import de.rinderle.softvis3d.VisualizationProcessorBean;
import de.rinderle.softvis3d.cache.LayoutCacheService;
import de.rinderle.softvis3d.cache.LayoutCacheServiceBean;
import de.rinderle.softvis3d.cache.SnapshotCacheService;
import de.rinderle.softvis3d.cache.SnapshotCacheServiceBean;
import de.rinderle.softvis3d.dao.*;
import de.rinderle.softvis3d.layout.LayoutProcessor;
import de.rinderle.softvis3d.layout.LayoutProcessorBean;
import de.rinderle.softvis3d.layout.bottomUp.BottomUpLayout;
import de.rinderle.softvis3d.layout.bottomUp.BottomUpLayoutBean;
import de.rinderle.softvis3d.layout.bottomUp.SnapshotVisitor;
import de.rinderle.softvis3d.layout.bottomUp.SnapshotVisitorBean;
import de.rinderle.softvis3d.layout.dot.*;
import de.rinderle.softvis3d.layout.format.LayerFormatter;
import de.rinderle.softvis3d.layout.format.LayerFormatterBean;
import de.rinderle.softvis3d.postprocessing.PostProcessor;
import de.rinderle.softvis3d.postprocessing.PostProcessorBean;
import de.rinderle.softvis3d.preprocessing.PreProcessor;
import de.rinderle.softvis3d.preprocessing.PreProcessorBean;
import de.rinderle.softvis3d.preprocessing.dependencies.DependencyExpander;
import de.rinderle.softvis3d.preprocessing.dependencies.DependencyExpanderBean;
import de.rinderle.softvis3d.preprocessing.tree.OptimizeTreeStructure;
import de.rinderle.softvis3d.preprocessing.tree.OptimizeTreeStructureImpl;
import de.rinderle.softvis3d.preprocessing.tree.TreeBuilder;
import de.rinderle.softvis3d.preprocessing.tree.TreeBuilderBean;
import de.rinderle.softvis3d.webservice.config.ConfigWebserviceHandler;
import de.rinderle.softvis3d.webservice.config.ConfigWebserviceHandlerBean;
import de.rinderle.softvis3d.webservice.tree.TreeNodeJsonWriter;
import de.rinderle.softvis3d.webservice.tree.TreeNodeJsonWriterImpl;
import de.rinderle.softvis3d.webservice.tree.TreeWebserviceHandler;
import de.rinderle.softvis3d.webservice.tree.TreeWebserviceHandlerBean;
import de.rinderle.softvis3d.webservice.visualization.VisualizationJsonWriter;
import de.rinderle.softvis3d.webservice.visualization.VisualizationJsonWriterImpl;
import de.rinderle.softvis3d.webservice.visualization.VisualizationWebserviceHandler;
import de.rinderle.softvis3d.webservice.visualization.VisualizationWebserviceHandlerBean;

public class SoftVis3DModule extends AbstractModule {
	@Override
	protected void configure() {
		this.bind(DotVersion.class).to(DotVersionImpl.class);
		this.bind(DotExecutor.class).to(DotExecutorImpl.class);
		this.bind(ExecuteCommand.class).to(ExecuteCommandImpl.class);

		this.bind(SonarDao.class).to(SonarDaoBean.class);
		this.bind(DependencyDao.class).to(DependencyDaoBean.class);
		this.bind(DaoService.class).to(DaoServiceBean.class);

    this.bind(ScmCalculationService.class).to(ScmCalculationServiceBean.class);

		this.bind(OptimizeTreeStructure.class).to(
				OptimizeTreeStructureImpl.class);
		this.bind(SnapshotCacheService.class)
				.to(SnapshotCacheServiceBean.class);
		this.bind(DependencyExpander.class).to(DependencyExpanderBean.class);

		this.bind(VisualizationProcessor.class).to(
				VisualizationProcessorBean.class);
		this.bind(LayerFormatter.class).to(LayerFormatterBean.class);

		this.bind(PostProcessor.class).to(PostProcessorBean.class);

		this.bind(PreProcessor.class).to(PreProcessorBean.class);
		this.bind(TreeBuilder.class).to(TreeBuilderBean.class);

		this.bind(LayoutProcessor.class).to(LayoutProcessorBean.class);

    this.bind(LayoutCacheService.class)
            .to(LayoutCacheServiceBean.class);

		this.bind(TreeNodeJsonWriter.class).to(TreeNodeJsonWriterImpl.class);
		this.bind(TreeWebserviceHandler.class).to(
				TreeWebserviceHandlerBean.class);
		this.bind(VisualizationJsonWriter.class).to(
				VisualizationJsonWriterImpl.class);
		this.bind(VisualizationWebserviceHandler.class).to(
				VisualizationWebserviceHandlerBean.class);
		this.bind(ConfigWebserviceHandler.class).to(
				ConfigWebserviceHandlerBean.class);

		this.install(new FactoryModuleBuilder().implement(
				SnapshotVisitor.class, SnapshotVisitorBean.class).build(
				SnapshotVisitorFactory.class));

		this.bind(BottomUpLayout.class).to(BottomUpLayoutBean.class);
	}
}
