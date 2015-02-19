/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d;

import de.rinderle.softvis3d.domain.sonar.ScmInfo;
import org.junit.Test;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

import static org.junit.Assert.assertSame;

public class ScmProviderTest {

	@Test
	public void test() throws ParseException {
    final String scmInfo = getSecondExample();
    final String scmTimeInfo = getSecondExampleTime();

    final String[] resultCommitters = scmInfo.split(";");
    final String[] resultScmTime = scmTimeInfo.split(";");

    final List<ScmInfo> resultList = new ArrayList<ScmInfo>();

    for (int i = 0; i < resultCommitters.length; i++) {
      final String[] committerSplit = resultCommitters[i].split("=");
      final String[] scmTimeSplit = resultScmTime[i].split("=");
      final SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssZ");
			final ScmInfo currentScmInfo = new ScmInfo(
					Integer.valueOf(committerSplit[0]), committerSplit[1],
					format.parse(scmTimeSplit[1]));

      resultList.add(currentScmInfo);
    }

    final int differentUsers = getDifferentUsers(resultList);
    assertSame(2, differentUsers);

    for (ScmInfo info : resultList) {
      System.out.println(info.toString());
    }
	}

  private int getDifferentUsers(final List<ScmInfo> result) {
    final Map<String, Integer> usersResultList = getUsersWithLineCount(result);

    return usersResultList.size();
  }

  private Map<String, Integer> getUsersWithLineCount(List<ScmInfo> resultList) {
    final Map<String, Integer> usersResultList = new HashMap<String, Integer>();

    for (ScmInfo current : resultList) {
       if (!usersResultList.containsKey(current)) {
         usersResultList.put(current.getCommitter(), 1);
       } else {
         usersResultList.put(current.getCommitter(), usersResultList.get(current.getCommitter()) + 1);
       }
    }
    return usersResultList;
  }

  private String getExample() {
		return "1=martinc@apache.org;2=bayard@apache.org;3=bayard@apache.org;4=bayard@apache.org;5=bayard@apache.org;6=bayard@apache.org;7=bayard@apache.org;8=martinc@apache.org;9=martinc@apache.org;10=martinc@apache.org;11=martinc@apache.org;12=martinc@apache.org;13=martinc@apache.org;14=martinc@apache.org;15=martinc@apache.org;16=martinc@apache.org;17=martinc@apache.org;18=martinc@apache.org;19=martinc@apache.org;20=martinc@apache.org;21=martinc@apache.org;22=martinc@apache.org;23=martinc@apache.org;24=scolebourne@apache.org;25=scolebourne@apache.org;26=scolebourne@apache.org;27=scolebourne@apache.org;28=scolebourne@apache.org;29=scolebourne@apache.org;30=scolebourne@apache.org;31=scolebourne@apache.org;32=bayard@apache.org;33=ggregory@apache.org;34=martinc@apache.org;35=dirkv@apache.org;36=jochen@apache.org;37=martinc@apache.org;38=niallp@apache.org;39=martinc@apache.org;40=martinc@apache.org;41=jochen@apache.org;42=martinc@apache.org;43=jochen@apache.org;44=martinc@apache.org;45=scolebourne@apache.org;46=martinc@apache.org;47=martinc@apache.org;48=martinc@apache.org;49=scolebourne@apache.org;50=martinc@apache.org;51=scolebourne@apache.org;52=scolebourne@apache.org;53=scolebourne@apache.org;54=jochen@apache.org;55=martinc@apache.org;56=sebb@apache.org;57=ggregory@apache.org;58=jochen@apache.org;59=martinc@apache.org;60=martinc@apache.org;61=martinc@apache.org;62=martinc@apache.org;63=martinc@apache.org;64=scolebourne@apache.org;65=martinc@apache.org;66=scolebourne@apache.org;67=scolebourne@apache.org;68=scolebourne@apache.org;69=scolebourne@apache.org;70=jochen@apache.org;71=scolebourne@apache.org;72=sebb@apache.org;73=ggregory@apache.org;74=jochen@apache.org;75=scolebourne@apache.org;76=scolebourne@apache.org;77=scolebourne@apache.org;78=scolebourne@apache.org;79=scolebourne@apache.org;80=scolebourne@apache.org;81=scolebourne@apache.org;82=scolebourne@apache.org;83=scolebourne@apache.org;84=scolebourne@apache.org;85=jochen@apache.org;86=martinc@apache.org;87=sebb@apache.org;88=ggregory@apache.org;89=jochen@apache.org;90=scolebourne@apache.org;91=scolebourne@apache.org;92=scolebourne@apache.org;93=scolebourne@apache.org;94=scolebourne@apache.org;95=scolebourne@apache.org;96=scolebourne@apache.org;97=scolebourne@apache.org;98=scolebourne@apache.org;99=scolebourne@apache.org;100=scolebourne@apache.org;101=jochen@apache.org;102=scolebourne@apache.org;103=sebb@apache.org;104=ggregory@apache.org;105=jochen@apache.org;106=martinc@apache.org;107=martinc@apache.org;108=scolebourne@apache.org;109=martinc@apache.org;110=martinc@apache.org;111=martinc@apache.org;112=martinc@apache.org;113=scolebourne@apache.org;114=jochen@apache.org;115=martinc@apache.org;116=sebb@apache.org;117=martinc@apache.org;118=jochen@apache.org;119=martinc@apache.org;120=martinc@apache.org;121=scolebourne@apache.org;122=scolebourne@apache.org;123=scolebourne@apache.org;124=scolebourne@apache.org;125=scolebourne@apache.org;126=scolebourne@apache.org;127=scolebourne@apache.org;128=scolebourne@apache.org;129=scolebourne@apache.org;130=scolebourne@apache.org;131=scolebourne@apache.org;132=scolebourne@apache.org;133=scolebourne@apache.org;134=scolebourne@apache.org;135=scolebourne@apache.org;136=scolebourne@apache.org;137=scolebourne@apache.org;138=scolebourne@apache.org;139=ggregory@apache.org;140=ggregory@apache.org;141=scolebourne@apache.org;142=jochen@apache.org;143=scolebourne@apache.org;144=sebb@apache.org;145=scolebourne@apache.org;146=jochen@apache.org;147=scolebourne@apache.org;148=scolebourne@apache.org;149=scolebourne@apache.org;150=jochen@apache.org;151=jochen@apache.org;152=jochen@apache.org;153=jochen@apache.org;154=ggregory@apache.org;155=ggregory@apache.org;156=scolebourne@apache.org;157=jochen@apache.org;158=jochen@apache.org;159=scolebourne@apache.org;160=martinc@apache.org;161=martinc@apache.org";
	}

  private String getSecondExample() {
    return "1=niallp@apache.org;2=niallp@apache.org;3=niallp@apache.org;4=niallp@apache.org;5=niallp@apache.org;6=niallp@apache.org;7=niallp@apache.org;8=niallp@apache.org;9=niallp@apache.org;10=niallp@apache.org;11=niallp@apache.org;12=niallp@apache.org;13=niallp@apache.org;14=niallp@apache.org;15=niallp@apache.org;16=niallp@apache.org;17=niallp@apache.org;18=niallp@apache.org;19=niallp@apache.org;20=niallp@apache.org;21=niallp@apache.org;22=niallp@apache.org;23=niallp@apache.org;24=niallp@apache.org;25=niallp@apache.org;26=ggregory@apache.org;27=niallp@apache.org;28=niallp@apache.org;29=niallp@apache.org;30=niallp@apache.org;31=niallp@apache.org;32=niallp@apache.org;33=niallp@apache.org;34=niallp@apache.org;35=niallp@apache.org;36=niallp@apache.org;37=niallp@apache.org;38=niallp@apache.org;39=niallp@apache.org;40=niallp@apache.org;41=niallp@apache.org;42=niallp@apache.org;43=niallp@apache.org;44=niallp@apache.org;45=niallp@apache.org;46=niallp@apache.org;47=ggregory@apache.org;48=niallp@apache.org;49=niallp@apache.org;50=niallp@apache.org;51=niallp@apache.org;52=niallp@apache.org;53=niallp@apache.org;54=niallp@apache.org;55=niallp@apache.org;56=ggregory@apache.org;57=niallp@apache.org;58=niallp@apache.org;59=niallp@apache.org;60=niallp@apache.org;61=niallp@apache.org";
  }

  private String getSecondExampleTime() {
    return "1=2010-08-05T01:56:03+0200;2=2010-08-05T01:56:03+0200;3=2010-08-05T01:56:03+0200;4=2010-08-05T01:56:03+0200;5=2010-08-05T01:56:03+0200;6=2010-08-05T01:56:03+0200;7=2010-08-05T01:56:03+0200;8=2010-08-05T01:56:03+0200;9=2010-08-05T01:56:03+0200;10=2010-08-05T01:56:03+0200;11=2010-08-05T01:56:03+0200;12=2010-08-05T01:56:03+0200;13=2010-08-05T01:56:03+0200;14=2010-08-05T01:56:03+0200;15=2010-08-05T01:56:03+0200;16=2010-08-05T01:56:03+0200;17=2010-08-05T01:56:03+0200;18=2010-08-05T01:56:03+0200;19=2010-08-05T01:56:03+0200;20=2010-08-05T01:56:03+0200;21=2010-08-05T01:56:03+0200;22=2010-08-05T01:56:03+0200;23=2010-08-05T01:56:03+0200;24=2010-08-05T01:56:03+0200;25=2010-08-05T01:56:03+0200;26=2012-03-22T21:55:29+0100;27=2010-08-05T01:56:03+0200;28=2010-08-05T01:56:03+0200;29=2010-08-05T01:56:03+0200;30=2010-08-05T01:56:03+0200;31=2010-08-05T01:56:03+0200;32=2010-08-05T01:56:03+0200;33=2010-08-05T01:56:03+0200;34=2010-08-05T01:56:03+0200;35=2010-08-05T01:56:03+0200;36=2010-08-05T01:56:03+0200;37=2010-08-05T01:56:03+0200;38=2010-08-05T01:56:03+0200;39=2010-08-05T01:56:03+0200;40=2010-08-05T01:56:03+0200;41=2010-08-05T01:56:03+0200;42=2010-08-05T01:56:03+0200;43=2010-08-05T01:56:03+0200;44=2010-08-05T01:56:03+0200;45=2010-08-05T01:56:03+0200;46=2010-08-05T01:56:03+0200;47=2012-11-30T21:51:39+0100;48=2010-08-05T01:56:03+0200;49=2010-08-05T01:56:03+0200;50=2010-08-05T01:56:03+0200;51=2010-08-05T01:56:03+0200;52=2010-08-05T01:56:03+0200;53=2010-08-05T01:56:03+0200;54=2010-08-05T01:56:03+0200;55=2010-08-05T01:56:03+0200;56=2012-11-30T21:51:39+0100;57=2010-08-05T01:56:03+0200;58=2010-08-05T01:56:03+0200;59=2010-08-05T01:56:03+0200;60=2010-08-05T01:56:03+0200;61=2010-08-05T01:56:03+0200";
  }

}
