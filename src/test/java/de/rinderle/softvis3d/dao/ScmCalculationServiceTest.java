/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.dao;

import org.junit.Test;

import java.text.ParseException;

import static org.junit.Assert.assertSame;

public class ScmCalculationServiceTest {

    private final ScmCalculationService scmCalculationService = new ScmCalculationServiceBean();

    @Test
    public void testFirstExample() throws ParseException {
        final int differentUsers = scmCalculationService.getDifferentAuthors(getFirstExample(), getFirstExampleTime());
        assertSame(3, differentUsers);
    }

    @Test
    public void testSecondExample() throws ParseException {
        final int differentUsers =
                scmCalculationService.getDifferentAuthors(getSecondExample(), getSecondExampleTime());
        assertSame(2, differentUsers);
    }

    public String getFirstExample() {
        return "1=andrew@raines.me;2=simonw@apache.org;3=simonw@apache.org;4=simonw@apache.org;5=simonw@apache.org;6=simonw@apache.org;7=simonw@apache.org;8=simonw@apache.org;9=andrew@raines.me;10=andrew@raines.me;11=andrew@raines.me;12=andrew@raines.me;13=andrew@raines.me;14=andrew@raines.me;15=andrew@raines.me;16=andrew@raines.me;17=andrew@raines.me;18=andrew@raines.me;19=andrew@raines.me;20=andrew@raines.me;21=andrew@raines.me;22=andrew@raines.me;23=kimchy@gmail.com;24=andrew@raines.me;25=kimchy@gmail.com;26=andrew@raines.me;27=andrew@raines.me;28=andrew@raines.me;29=andrew@raines.me;30=andrew@raines.me;31=kimchy@gmail.com;32=kimchy@gmail.com;33=kimchy@gmail.com;34=kimchy@gmail.com;35=andrew@raines.me;36=andrew@raines.me";
    }

    public String getFirstExampleTime() {
        return "1=2013-09-11T19:49:49+0200;2=2014-01-06T22:48:02+0100;3=2014-01-06T22:48:02+0100;4=2014-01-06T22:48:02+0100;5=2014-01-06T22:48:02+0100;6=2014-01-06T22:48:02+0100;7=2014-01-06T22:48:02+0100;8=2014-01-06T22:48:02+0100;9=2013-09-11T19:49:49+0200;10=2013-09-11T19:49:49+0200;11=2013-09-11T19:49:49+0200;12=2013-09-11T19:49:49+0200;13=2013-09-11T19:49:49+0200;14=2013-09-11T19:49:49+0200;15=2013-09-11T19:49:49+0200;16=2013-09-11T19:49:49+0200;17=2013-09-11T19:49:49+0200;18=2013-09-11T19:49:49+0200;19=2013-09-11T19:49:49+0200;20=2013-09-11T19:49:49+0200;21=2013-09-11T19:49:49+0200;22=2013-09-11T19:49:49+0200;23=2014-03-31T22:13:57+0200;24=2013-09-11T19:49:49+0200;25=2014-03-31T22:13:57+0200;26=2013-09-11T19:49:49+0200;27=2013-09-11T19:49:49+0200;28=2013-09-11T19:49:49+0200;29=2013-09-11T19:49:49+0200;30=2013-09-11T19:49:49+0200;31=2014-03-31T22:13:57+0200;32=2014-03-31T22:13:57+0200;33=2014-03-31T22:13:57+0200;34=2014-03-31T22:13:57+0200;35=2013-09-11T19:49:49+0200;36=2013-09-11T19:49:49+0200";
    }

    private String getSecondExample() {
        return "1=niallp@apache.org;2=niallp@apache.org;3=niallp@apache.org;4=niallp@apache.org;5=niallp@apache.org;6=niallp@apache.org;7=niallp@apache.org;8=niallp@apache.org;9=niallp@apache.org;10=niallp@apache.org;11=niallp@apache.org;12=niallp@apache.org;13=niallp@apache.org;14=niallp@apache.org;15=niallp@apache.org;16=niallp@apache.org;17=niallp@apache.org;18=niallp@apache.org;19=niallp@apache.org;20=niallp@apache.org;21=niallp@apache.org;22=niallp@apache.org;23=niallp@apache.org;24=niallp@apache.org;25=niallp@apache.org;26=ggregory@apache.org;27=niallp@apache.org;28=niallp@apache.org;29=niallp@apache.org;30=niallp@apache.org;31=niallp@apache.org;32=niallp@apache.org;33=niallp@apache.org;34=niallp@apache.org;35=niallp@apache.org;36=niallp@apache.org;37=niallp@apache.org;38=niallp@apache.org;39=niallp@apache.org;40=niallp@apache.org;41=niallp@apache.org;42=niallp@apache.org;43=niallp@apache.org;44=niallp@apache.org;45=niallp@apache.org;46=niallp@apache.org;47=ggregory@apache.org;48=niallp@apache.org;49=niallp@apache.org;50=niallp@apache.org;51=niallp@apache.org;52=niallp@apache.org;53=niallp@apache.org;54=niallp@apache.org;55=niallp@apache.org;56=ggregory@apache.org;57=niallp@apache.org;58=niallp@apache.org;59=niallp@apache.org;60=niallp@apache.org;61=niallp@apache.org";
    }

    private String getSecondExampleTime() {
        return "1=2010-08-05T01:56:03+0200;2=2010-08-05T01:56:03+0200;3=2010-08-05T01:56:03+0200;4=2010-08-05T01:56:03+0200;5=2010-08-05T01:56:03+0200;6=2010-08-05T01:56:03+0200;7=2010-08-05T01:56:03+0200;8=2010-08-05T01:56:03+0200;9=2010-08-05T01:56:03+0200;10=2010-08-05T01:56:03+0200;11=2010-08-05T01:56:03+0200;12=2010-08-05T01:56:03+0200;13=2010-08-05T01:56:03+0200;14=2010-08-05T01:56:03+0200;15=2010-08-05T01:56:03+0200;16=2010-08-05T01:56:03+0200;17=2010-08-05T01:56:03+0200;18=2010-08-05T01:56:03+0200;19=2010-08-05T01:56:03+0200;20=2010-08-05T01:56:03+0200;21=2010-08-05T01:56:03+0200;22=2010-08-05T01:56:03+0200;23=2010-08-05T01:56:03+0200;24=2010-08-05T01:56:03+0200;25=2010-08-05T01:56:03+0200;26=2012-03-22T21:55:29+0100;27=2010-08-05T01:56:03+0200;28=2010-08-05T01:56:03+0200;29=2010-08-05T01:56:03+0200;30=2010-08-05T01:56:03+0200;31=2010-08-05T01:56:03+0200;32=2010-08-05T01:56:03+0200;33=2010-08-05T01:56:03+0200;34=2010-08-05T01:56:03+0200;35=2010-08-05T01:56:03+0200;36=2010-08-05T01:56:03+0200;37=2010-08-05T01:56:03+0200;38=2010-08-05T01:56:03+0200;39=2010-08-05T01:56:03+0200;40=2010-08-05T01:56:03+0200;41=2010-08-05T01:56:03+0200;42=2010-08-05T01:56:03+0200;43=2010-08-05T01:56:03+0200;44=2010-08-05T01:56:03+0200;45=2010-08-05T01:56:03+0200;46=2010-08-05T01:56:03+0200;47=2012-11-30T21:51:39+0100;48=2010-08-05T01:56:03+0200;49=2010-08-05T01:56:03+0200;50=2010-08-05T01:56:03+0200;51=2010-08-05T01:56:03+0200;52=2010-08-05T01:56:03+0200;53=2010-08-05T01:56:03+0200;54=2010-08-05T01:56:03+0200;55=2010-08-05T01:56:03+0200;56=2012-11-30T21:51:39+0100;57=2010-08-05T01:56:03+0200;58=2010-08-05T01:56:03+0200;59=2010-08-05T01:56:03+0200;60=2010-08-05T01:56:03+0200;61=2010-08-05T01:56:03+0200";
    }

}
