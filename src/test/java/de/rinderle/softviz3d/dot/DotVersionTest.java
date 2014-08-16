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

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import java.util.HashMap;
import java.util.Map;

import org.junit.Test;
import org.sonar.api.config.Settings;

import de.rinderle.softviz3d.layout.dot.DotExcecutorException;
import de.rinderle.softviz3d.layout.dot.DotVersion;
import de.rinderle.softviz3d.layout.interfaces.SoftViz3dConstants;

public class DotVersionTest {

    @Test
    public void test() throws DotExcecutorException {
        Settings settings = new Settings();
        Map<String, String> props = new HashMap<String, String>();
        props.put(SoftViz3dConstants.DOT_BIN_KEY, "/usr/local/bin/dot");
        settings.addProperties(props);
        String result = DotVersion.getInstance().getVersion(settings);
        
        System.out.println(result);
        
        assertFalse(result.isEmpty());
        assertFalse(result.contains("dot - graphviz version"));
        assertFalse(result.contains(" "));
        
        assertTrue(result.contains("."));
    }

}
