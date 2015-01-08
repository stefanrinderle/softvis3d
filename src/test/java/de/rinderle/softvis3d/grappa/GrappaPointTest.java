/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.grappa;

import att.grappa.GrappaPoint;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

/**
 * Checks the strange behaviour of grappa on points. Just to be sure nothing
 * changes here.
 */
public class GrappaPointTest {

	@Test
	public void test() {
		final GrappaPoint pos = new GrappaPoint(-7, -9);

		assertTrue(-7 == pos.getX());
		assertTrue(-9 == pos.getY());

		assertTrue(-7 == pos.x);
		assertTrue(-9 == pos.y);
	}

	@Test
	public void testSplit() {
		final GrappaPoint pos = new GrappaPoint(-7, -9);

		final String attributeString = pos.toAttributeString();

		final String[] attributePos = attributeString.split(",");

		assertEquals("-7", attributePos[0]);
		assertEquals("9", attributePos[1]);

		assertTrue(-7 == pos.x);
		assertTrue(-9 == pos.y);
	}

	@Test
	public void testStringConversion() {
		final GrappaPoint pos = new GrappaPoint("48,-12");

		assertTrue(48 == pos.x);
		assertTrue(12 == pos.y);
	}

}
