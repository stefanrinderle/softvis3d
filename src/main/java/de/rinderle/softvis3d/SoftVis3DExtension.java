/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sonar.api.ServerExtension;

import java.text.DateFormat;
import java.util.Calendar;

public class SoftVis3DExtension implements ServerExtension {

  private static final Logger LOGGER = LoggerFactory
          .getLogger(SoftVis3DExtension.class);

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
    licenceEndDate.set(2015, 5, 30, 0, 0);

    final int compareResult = now.compareTo(licenceEndDate);

    final String dateStringEndOfLicence =
            DateFormat.getDateTimeInstance(DateFormat.MEDIUM, DateFormat.SHORT).format(licenceEndDate.getTime());
    LOGGER.debug("Checking licence which is valid till " + dateStringEndOfLicence);
    final String dateStringNow = DateFormat.getDateTimeInstance(DateFormat.MEDIUM, DateFormat.SHORT).format(now.getTime());
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
