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

import de.rinderle.softviz3d.layout.calc.LayoutVisitorImpl;
import de.rinderle.softviz3d.layout.calc.LayoutVisitor;
import de.rinderle.softviz3d.layout.dot.DotExcecutorImpl;
import de.rinderle.softviz3d.layout.dot.DotExecutor;
import de.rinderle.softviz3d.layout.dot.DotVersion;
import de.rinderle.softviz3d.layout.dot.DotVersionImpl;
import de.rinderle.softviz3d.layout.dot.ExecuteCommand;
import de.rinderle.softviz3d.layout.dot.ExecuteCommandImpl;

public class SoftViz3dModule extends AbstractModule {
    @Override
    protected void configure() {
        bind(DotVersion.class).to(DotVersionImpl.class);
        bind(DotExecutor.class).to(DotExcecutorImpl.class);
        bind(ExecuteCommand.class).to(ExecuteCommandImpl.class);

        install(new FactoryModuleBuilder().implement(LayoutVisitor.class,
                LayoutVisitorImpl.class).build(LayoutVisitorFactory.class));
    }
}