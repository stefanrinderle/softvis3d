/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
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

	@Mock
	private ExecuteCommand executeCommand;

	@InjectMocks
	private final DotVersion underTest = new DotVersionImpl();

	@Before
	public void setUp() {
		MockitoAnnotations.initMocks(this);
	}

	@Test
	public void testHappy() throws DotExecutorException {
		final String version = "2.20.2";
		final String versionInfo = "dot - Graphviz version " + version
				+ " (Tue Jan 14 19:38:44 UTC 2014)";
		Mockito.when(
				this.executeCommand.executeCommandReadErrorStream(Mockito
						.any(String.class))).thenReturn(versionInfo);

		final String result = this.underTest.getVersion("dotBin");

		assertNotNull(result);
		assertTrue(version.equals(result));
	}

}
