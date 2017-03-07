/*
 * softvis3d-base
 * Copyright (C) 2015 Stefan Rinderle
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
package de.rinderle.softvis3d.base.result;

import de.rinderle.softvis3d.base.TestTreeBuilder;
import de.rinderle.softvis3d.base.domain.tree.RootTreeNode;

import java.io.IOException;
import java.io.OutputStream;

import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class TreeNodeJsonWriterTest {

  @Test
  public void testTransformTreeToJsonEmpty() throws Exception {
    final StringOutputStream stringOutputStream = new StringOutputStream();
    final SoftVis3dJsonWriter jsonWriter = new SoftVis3dJsonWriter(stringOutputStream);

    final TreeNodeJsonWriter underTest = new TreeNodeJsonWriter();

    final RootTreeNode tree = new RootTreeNode("1");
    underTest.transformRootTreeToJson(jsonWriter, tree);

    jsonWriter.close();

    final String expectedStringResult = "{\"id\":\"1\",\"name\":\"root\",\"isNode\":false,\"children\":[]}";

    assertEquals(expectedStringResult, stringOutputStream.toString());
  }

  @Test
  public void testTransformWithChildrenNodes() {
    final StringOutputStream stringOutputStream = new StringOutputStream();
    final SoftVis3dJsonWriter jsonWriter = new SoftVis3dJsonWriter(stringOutputStream);

    final TreeNodeJsonWriter underTest = new TreeNodeJsonWriter();

    final RootTreeNode treeNode1 = new RootTreeNode("1");
    TestTreeBuilder.createValueTreeNode("2", "2", treeNode1, 1);
    TestTreeBuilder.createValueTreeNode("3", "3", treeNode1, 2);

    underTest.transformRootTreeToJson(jsonWriter, treeNode1);

    jsonWriter.close();

    final String expectedResult = "{\"id\":\"1\",\"name\":\"root\",\"isNode\":true,\"children\":[{\"id\":\"2\",\"name\":\"2\",\"isNode\":false,\"key\":\"2\",\"measures\":{\"complexity\":1.0,\"ncloc\":12.32},\"parentId\":\"1\",\"children\":[]},{\"id\":\"3\",\"name\":\"3\",\"isNode\":false,\"key\":\"3\",\"measures\":{\"complexity\":1.0,\"ncloc\":12.32},\"parentId\":\"1\",\"children\":[]}]}";

    assertEquals(expectedResult, stringOutputStream.toString());
  }

  private class StringOutputStream extends OutputStream {

    private final StringBuilder string = new StringBuilder();

    @Override
    public void write(final int b) throws IOException {
      this.string.append((char) b);
    }

    @Override
    public String toString() {
      return this.string.toString();
    }
  }

}
