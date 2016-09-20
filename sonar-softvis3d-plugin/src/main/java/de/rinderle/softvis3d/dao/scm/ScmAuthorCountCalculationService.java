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
package de.rinderle.softvis3d.dao.scm;

import de.rinderle.softvis3d.domain.ScmInfo;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ScmAuthorCountCalculationService extends ScmCalculationService {

  private static final Logger LOGGER = LoggerFactory.getLogger(ScmAuthorCountCalculationService.class);
  private final SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssZ");

  @Override
  public int getNodeValue(final String scmCommitterString, final String scmTimeString) {
    final int authorCount;

    if (StringUtils.isBlank(scmCommitterString)) {
      authorCount = 0;
    } else {
      final List<ScmInfo> resultList = extractScmInfo(scmCommitterString, scmTimeString);
      authorCount = getDifferentUsers(resultList);
    }

    return authorCount;
  }

  private List<ScmInfo> extractScmInfo(final String scmCommitterString, final String scmTimeString) {
    final String[] resultCommitter = splitPlainScmInfo(scmCommitterString);
    String[] resultScmTime = new String[0];

    final boolean isTimeGiven = !StringUtils.isBlank(scmTimeString);
    if (isTimeGiven) {
      resultScmTime = splitPlainScmInfo(scmTimeString);
    }

    final List<ScmInfo> resultList = new ArrayList<>();

    for (int index = 0; index < resultCommitter.length; index++) {
      final String[] committerSplit = resultCommitter[index].split("=");

      final ScmInfo currentScmInfo;
      if (isTimeGiven) {
        final String[] scmTimeSplit = resultScmTime[index].split("=");
        final Date date = getDate(scmTimeSplit[1]);

        currentScmInfo = new ScmInfo(Integer.valueOf(committerSplit[0]), committerSplit[1], date);
      } else {
        currentScmInfo = new ScmInfo(Integer.valueOf(committerSplit[0]), committerSplit[1]);
      }

      resultList.add(currentScmInfo);
    }
    return resultList;
  }

  private Date getDate(final String source) {
    try {
      return simpleDateFormat.parse(source);
    } catch (final ParseException e) {
      LOGGER.error("Could not parse date " + source, e);
      return new Date();
    }
  }

  private int getDifferentUsers(final List<ScmInfo> result) {
    final Map<String, Integer> usersResultList = getUsersWithLineCount(result);

    return usersResultList.size();
  }

  private Map<String, Integer> getUsersWithLineCount(final List<ScmInfo> resultList) {
    final Map<String, Integer> usersResultList = new HashMap<>();

    for (final ScmInfo current : resultList) {
      if (usersResultList.containsKey(current.getCommitter())) {
        usersResultList.put(current.getCommitter(), usersResultList.get(current.getCommitter()) + 1);
      } else {
        usersResultList.put(current.getCommitter(), 1);
      }
    }
    return usersResultList;
  }

}
