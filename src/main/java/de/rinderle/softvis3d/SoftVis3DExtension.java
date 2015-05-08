/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
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
package de.rinderle.softvis3d;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sonar.api.ServerExtension;

import java.text.DateFormat;
import java.util.Calendar;

public class SoftVis3DExtension implements ServerExtension {

  private static final Logger LOGGER = LoggerFactory.getLogger(SoftVis3DExtension.class);

  public SoftVis3DExtension() {
    LOGGER.warn("Constructor SoftVis3DExtension");
  }

  public boolean isProd() {
    return SoftVis3DPlugin.IS_PROD;
  }

  public boolean isLicenseValid() {
    final Calendar now = Calendar.getInstance();
    now.getTime();

    final Calendar licenceEndDate = Calendar.getInstance();
    licenceEndDate.set(2015, 8, 30, 0, 0);

    final int compareResult = now.compareTo(licenceEndDate);

    final String dateStringEndOfLicence =
      DateFormat.getDateTimeInstance(DateFormat.MEDIUM, DateFormat.SHORT).format(licenceEndDate.getTime());
    LOGGER.debug("Checking licence which is valid till " + dateStringEndOfLicence);
    final String dateStringNow =
      DateFormat.getDateTimeInstance(DateFormat.MEDIUM, DateFormat.SHORT).format(now.getTime());
    LOGGER.debug("System time " + dateStringNow);

    boolean isValid;
    if (compareResult <= 0) {
      LOGGER.debug("Licence valid " + compareResult);
      isValid = true;
    } else {
      LOGGER.debug("Licence invalid " + compareResult);
      isValid = false;
    }

    return isValid;
  }
}
