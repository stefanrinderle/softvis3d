/**
 * SoftVis3D Sonar plugin
 * Copyright (C) 2016 Stefan Rinderle and Yvo Niedrich
 * stefan@rinderle.info / yvo.niedrich@gmail.com
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
package de.rinderle.softvis3d.webservice;

import java.io.IOException;
import java.io.OutputStream;
import java.util.concurrent.atomic.AtomicInteger;

import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;

import static org.junit.Assert.assertEquals;

public class SoftVis3dJsonWriterTest {
  private static final String EMPTY_STRING = "";

  @Rule
  public ExpectedException thrown = ExpectedException.none();

  final StringOutputStream stringOutputStream = new StringOutputStream();
  SoftVis3dJsonWriter writer = new SoftVis3dJsonWriter(stringOutputStream);

  private void expect(String s) {
    assertEquals(stringOutputStream.toString(), s);
  }

  @Test
  public void empty_object() {
    writer.beginObject().endObject().close();
    expect("{}");
  }

  @Test
  public void empty_array() {
    writer.beginArray().endArray().close();
    expect("[]");
  }

  @Test
  public void objects_and_arrays() {
    writer.beginObject().name("issues")
        .beginArray()
        .beginObject().prop("key", "ABC").endObject()
        .beginObject().prop("key", "DEF").endObject()
        .endArray()
        .endObject().close();
    expect("{\"issues\":[{\"key\":\"ABC\"},{\"key\":\"DEF\"}]}");
  }

  @Test
  public void type_of_values() {
    writer.beginObject()
        .prop("aBoolean", true)
        .prop("aInt", 123)
        .prop("aLong", 1000L)
        .prop("aDouble", 3.14)
        .prop("aNumber", new AtomicInteger(123456789))
        .prop("aString", "bar")
        .endObject().close();
    expect("{\"aBoolean\":true,\"aInt\":123,\"aLong\":1000,\"aDouble\":3.14,\"aNumber\":123456789,\"aString\":\"bar\"}");
  }

  @Test
  public void ignore_null_values_by_default() {
    writer.beginObject()
        .prop("nullNumber", (Number) null)
        .prop("nullString", (String) null)
        .name("nullNumber").value((Number) null)
        .name("nullString").value((String) null)
        .endObject().close();
    expect("{}");
  }

  @Test
  public void serialize_empty_strings_by_default() {
    writer.beginObject()
        .prop("emptyString", EMPTY_STRING)
        .name("emptyStringAsObject").value(EMPTY_STRING)
        .endObject().close();
    expect("{" +
        "\"emptyString\":\"\"," +
        "\"emptyStringAsObject\":\"\"" +
        "}");
  }

  @Test
  public void escape_values() {
    writer.beginObject()
        .prop("foo", "<hello \"world\">")
        .endObject().close();
    expect("{\"foo\":\"<hello \\\"world\\\">\"}");
  }

  @Test(expected = IllegalStateException.class)
  public void fail_on_NaN_value() {
    writer.beginObject().prop("foo", Double.NaN).endObject().close();
  }

  @Test(expected = IllegalStateException.class)
  public void fail_if_not_valid() {
    writer.beginObject().endArray().close();
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