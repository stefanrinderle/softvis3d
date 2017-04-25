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

import com.google.gson.stream.JsonWriter;

import java.io.OutputStream;
import java.io.OutputStreamWriter;

public class SoftVis3dJsonWriter {

  private final JsonWriter stream;

  public SoftVis3dJsonWriter(final OutputStream output) {
    this.stream = new JsonWriter(new OutputStreamWriter(output));
    this.stream.setSerializeNulls(false);
    this.stream.setLenient(false);
  }

  /**
   * Begins encoding a new array. Each call to this method must be paired with
   * a call to {@link #endArray}. Output is <code>[</code>.
   *
   */
  public SoftVis3dJsonWriter beginArray() {
    try {
      stream.beginArray();
      return this;
    } catch (final Exception e) {
      throw rethrow(e);
    }
  }

  /**
   * Ends encoding the current array. Output is <code>]</code>.
   */
  public SoftVis3dJsonWriter endArray() {
    try {
      stream.endArray();
      return this;
    } catch (final Exception e) {
      throw rethrow(e);
    }
  }

  /**
   * Begins encoding a new object. Each call to this method must be paired
   * with a call to {@link #endObject}. Output is <code>{</code>.
   */
  public SoftVis3dJsonWriter beginObject() {
    try {
      stream.beginObject();
      return this;
    } catch (final Exception e) {
      throw rethrow(e);
    }
  }

  /**
   * Ends encoding the current object. Output is <code>}</code>.
   */
  public SoftVis3dJsonWriter endObject() {
    try {
      stream.endObject();
      return this;
    } catch (final Exception e) {
      throw rethrow(e);
    }
  }

  /**
   * Encodes the property name. Output is <code>"theName":</code>.
   */
  public SoftVis3dJsonWriter name(final String name) {
    try {
      stream.name(name);
      return this;
    } catch (final Exception e) {
      throw rethrow(e);
    }
  }

  /**
   * Encodes {@code value}. Output is <code>true</code> or <code>false</code>.
   */
  public SoftVis3dJsonWriter value(final boolean value) {
    try {
      stream.value(value);
      return this;
    } catch (final Exception e) {
      throw rethrow(e);
    }
  }

  /**
   */
  public SoftVis3dJsonWriter value(final double value) {
    try {
      stream.value(value);
      return this;
    } catch (final Exception e) {
      throw rethrow(e);
    }
  }

  /**
   */
  public SoftVis3dJsonWriter value(final String value) {
    try {
      stream.value(value);
      return this;
    } catch (final Exception e) {
      throw rethrow(e);
    }
  }

  /**
   */
  public SoftVis3dJsonWriter value(final long value) {
    try {
      stream.value(value);
      return this;
    } catch (final Exception e) {
      throw rethrow(e);
    }
  }

  /**
   */
  public SoftVis3dJsonWriter value(final Number value) {
    try {
      stream.value(value);
      return this;
    } catch (final Exception e) {
      throw rethrow(e);
    }
  }

  /**
   * Encodes the property name and value. Output is for example <code>"theName":123</code>.
   */
  public SoftVis3dJsonWriter prop(final String name, final Number value) {
    return name(name).value(value);
  }

  /**
   */
  public SoftVis3dJsonWriter prop(final String name, final String value) {
    return name(name).value(value);
  }

  /**
   */
  public SoftVis3dJsonWriter prop(final String name, final boolean value) {
    return name(name).value(value);
  }

  /**
   */
  public SoftVis3dJsonWriter prop(final String name, final long value) {
    return name(name).value(value);
  }

  /**
   */
  public SoftVis3dJsonWriter prop(final String name, final double value) {
    return name(name).value(value);
  }

  /**
   */
  public void close() {
    try {
      stream.close();
    } catch (final Exception e) {
      throw rethrow(e);
    }
  }

  private IllegalStateException rethrow(final Exception e) {
    return new IllegalStateException(e.getMessage());
  }
}
