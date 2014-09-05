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
package de.rinderle.softviz3d.dot;

import junit.framework.TestCase;

import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.sonar.api.config.Settings;

import att.grappa.Graph;
import de.rinderle.softviz3d.layout.dot.DotExcecutorException;
import de.rinderle.softviz3d.layout.dot.DotExcecutorImpl;
import de.rinderle.softviz3d.layout.dot.DotVersion;
import de.rinderle.softviz3d.layout.dot.ExecuteCommand;

public class DotExecutorTest extends TestCase {

    @Mock
    private DotVersion dotVersion;

    @Mock
    private ExecuteCommand executeCommand;

    @InjectMocks
    private DotExcecutorImpl underTest = new DotExcecutorImpl();

    @Override
    public void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void testString() {
        String dotBin = "/usr/local/bin/dot";
        
        int lastIndex = dotBin.lastIndexOf("/");
        String result = dotBin.substring(0, lastIndex + 1);
        
        assertEquals("/usr/local/bin/", result);
    }
    
    @Test
    public void testHappy() throws DotExcecutorException {
        Mockito.when(dotVersion.getVersion(Mockito.any(Settings.class)))
                .thenReturn("2.36.0");

        Mockito.when(
                executeCommand.executeDotCommand(Mockito.any(String.class),
                        Mockito.any(String.class))).thenReturn(getADot());

        Graph inputGraph = new Graph("not used in test");
        Graph result = underTest.run(inputGraph, new Settings());

        assertNotNull(result);
        assertTrue("777".equals(result.getName()));
    }

    @Test
    public void testVersionFalse() throws DotExcecutorException {
        Mockito.when(dotVersion.getVersion(Mockito.any(Settings.class)))
                .thenReturn("2.36.0");

        Mockito.when(
                executeCommand.executeDotCommand(Mockito.any(String.class),
                        Mockito.any(String.class))).thenReturn(getADot());

        Graph inputGraph = new Graph("not used in test");
        underTest.run(inputGraph, new Settings());

        Mockito.verify(executeCommand, Mockito.times(1)).executeDotCommand(
                Mockito.any(String.class), Mockito.any(String.class));
    }

    @Test
    public void testVersionTrue() throws DotExcecutorException {
        Settings settings = new Settings();
        settings.setProperty("dotBinDirectory", "/usr/local/bin/dot");
        
        Mockito.when(dotVersion.getVersion(Mockito.any(Settings.class)))
                .thenReturn(DotExcecutorImpl.DOT_BUG_VERSION);

        Mockito.when(
                executeCommand.executeDotCommand(Mockito.any(String.class),
                        Mockito.any(String.class))).thenReturn(getADot());

        Graph inputGraph = new Graph("not used in test");
        underTest.run(inputGraph, settings);

        Mockito.verify(executeCommand, Mockito.times(2)).executeDotCommand(
                Mockito.any(String.class), Mockito.any(String.class));
    }

    public String getADot() {
        StringBuilder builder = new StringBuilder();
        builder.append("digraph 777 {");
        builder.append("\n");
        builder.append("graph [bb=\"0,0,612,600\"];");
        builder.append("\n");
        builder.append("subgraph 786 {");
        builder.append("\n");
        builder.append("843 [height=\"0.75\",");
        builder.append("\n");
        builder.append("metric1=\"29.0\",");
        builder.append("\n");
        builder.append("metric2=\"4.0\",");
        builder.append("\n");
        builder.append("pos=\"33,378\",");
        builder.append("\n");
        builder.append("width=\"0.75\"");
        builder.append("];");
        builder.append("\n");
        builder.append("}");
        builder.append("\n");
        builder.append("}");

        return builder.toString();
    }
}
