/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.layout.dot;

import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import static junit.framework.TestCase.assertTrue;
import static org.junit.Assert.assertNotNull;

public class DotVersionTest {

    @InjectMocks
    private final DotVersion underTest = new DotVersionImpl();
    @Mock
    private ExecuteCommand executeCommand;

    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void testHappy() throws DotExecutorException {
        final String versionString = "2.20.2";
        final Version version = new Version(versionString);
        final String versionInfo = "dot - Graphviz version " + versionString + " (Tue Jan 14 19:38:44 UTC 2014)";
        Mockito.when(this.executeCommand.executeCommandReadErrorStream(Mockito.any(String.class))).thenReturn(
                versionInfo);

        final Version result = this.underTest.getVersion("dotBin");

        assertNotNull(result);

        System.out.println(result);
        assertTrue(version.equals(result));
    }

    @Test
    public void testVersion2() throws DotExecutorException {
        final String versionString = "2.0";
        final Version version = new Version(versionString);
        final String versionInfo = "dot version " + versionString + " (Mon Apr  6 14:19:01 UTC 2015)";
        Mockito.when(this.executeCommand.executeCommandReadErrorStream(Mockito.any(String.class))).thenReturn(
                versionInfo);

        final Version result = this.underTest.getVersion("dotBin");

        System.out.println(result);

        assertNotNull(result);
        assertTrue(version.equals(result));
    }

}
