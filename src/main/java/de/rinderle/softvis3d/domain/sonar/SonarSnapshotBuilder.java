/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.domain.sonar;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

public class SonarSnapshotBuilder {

  private static final Logger LOGGER = LoggerFactory
          .getLogger(SonarSnapshotBuilder.class);

  private final static SimpleDateFormat SCM_DATE_FORMAT = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssZ");

	int id;
  String path;
  double footprintMetricValue;
  double heightMetricValue;
  public int committerCount;

  public SonarSnapshotBuilder(int id, String path) {
		this.id = id;
		this.path = path;
	}

	public SonarSnapshotBuilder footprintMetricValue(BigDecimal footprintMetricValue) {
    if (footprintMetricValue == null) {
      this.footprintMetricValue = BigDecimal.ZERO.doubleValue();
    } else {
      this.footprintMetricValue = footprintMetricValue.doubleValue();
    }

		return this;
	}

	public SonarSnapshotBuilder heightMetricValue(BigDecimal heightMetricValue) {
    if (heightMetricValue == null) {
      this.footprintMetricValue = BigDecimal.ZERO.doubleValue();
    } else {
      this.heightMetricValue = heightMetricValue.doubleValue();
    }

		return this;
	}

  public SonarSnapshotBuilder scmInfo(String scmCommitterString, String scmTimeString) {
    if (StringUtils.isBlank(scmCommitterString)) {
      this.committerCount = 0;
    } else {
      final List<ScmInfo> resultList = extractScmInfo(scmCommitterString, scmTimeString);

      this.committerCount = getDifferentUsers(resultList);
    }

    return this;
  }

  private List<ScmInfo> extractScmInfo(String scmCommitterString, String scmTimeString) {
    final String[] resultCommitter = scmCommitterString.split(";");
    String[] resultScmTime = new String[0];

    boolean isTimeGiven = !StringUtils.isBlank(scmTimeString);
    if (isTimeGiven) {
      resultScmTime = scmTimeString.split(";");
    }

    final List<ScmInfo> resultList = new ArrayList<ScmInfo>();

    for (int i = 0; i < resultCommitter.length; i++) {
      final String[] committerSplit = resultCommitter[i].split("=");

      final ScmInfo currentScmInfo;
      if (isTimeGiven) {
        final String[] scmTimeSplit = resultScmTime[i].split("=");
        final Date date = getDate(scmTimeSplit[1]);

        currentScmInfo = new ScmInfo(Integer.valueOf(committerSplit[0]), committerSplit[1], date);
      } else {
        currentScmInfo = new ScmInfo(Integer.valueOf(committerSplit[0]), committerSplit[1]);
      }

      resultList.add(currentScmInfo);
    }
    return resultList;
  }

  private Date getDate(String source) {
    try {
      return SCM_DATE_FORMAT.parse(source);
    } catch (ParseException e) {
      LOGGER.error("Could not parse date " + source, e);
      return new Date();
    }
  }

  private int getDifferentUsers(final List<ScmInfo> result) {
    final Map<String, Integer> usersResultList = getUsersWithLineCount(result);

    return usersResultList.size();
  }

  private Map<String, Integer> getUsersWithLineCount(List<ScmInfo> resultList) {
    final Map<String, Integer> usersResultList = new HashMap<String, Integer>();

    for (ScmInfo current : resultList) {
      if (!usersResultList.containsKey(current.getCommitter())) {
        usersResultList.put(current.getCommitter(), 1);
      } else {
        usersResultList.put(current.getCommitter(), usersResultList.get(current.getCommitter()) + 1);
      }
    }
    return usersResultList;
  }

	public SonarSnapshot build() {
		return new SonarSnapshot(this);
	}

}