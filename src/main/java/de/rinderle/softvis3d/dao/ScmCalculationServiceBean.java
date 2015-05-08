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
package de.rinderle.softvis3d.dao;

import de.rinderle.softvis3d.domain.sonar.ScmInfo;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ScmCalculationServiceBean implements ScmCalculationService {

  private static final Logger LOGGER = LoggerFactory.getLogger(ScmCalculationService.class);

  private static final SimpleDateFormat SCM_DATE_FORMAT = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssZ");

  @Override
  public int getDifferentAuthors(String scmCommitterString, String scmTimeString) {
    int authorCount;

    if (StringUtils.isBlank(scmCommitterString)) {
      authorCount = 0;
    } else {
      final List<ScmInfo> resultList = extractScmInfo(scmCommitterString, scmTimeString);

      authorCount = getDifferentUsers(resultList);
    }

    return authorCount;
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
}
