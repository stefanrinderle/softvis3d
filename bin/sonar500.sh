#!/bin/bash
INSTANZ="Sonar 500"

SCRIPTDIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

BASEDIR="/Users/stefan/opt/sonarqube-5.0/"
DEPLOYDIR=${BASEDIR}"extensions/downloads"
START=${BASEDIR}"bin/macosx-universal-64/sonar.sh"

PLUGINFILE="src/main/java/de/rinderle/softvis3d/SoftVis3DPlugin.java"
ARTEFACT="target/sonar-softVis3D-plugin-0.2.8-SNAPSHOT.jar"

RUNNERCONFIG="/Users/stefan/opt/sonar-runner-2.4/conf/sonar-runner.properties"

echo ${INSTANZ}

cd ${SCRIPTDIR}/../

case "$1" in

'init')
    echo "init sonar runner"

    sed -i '' 's/^\(sonar\.jdbc\.username\s*=\s*\).*$/\sonar\.jdbc\.username=sonar500/' ${RUNNERCONFIG}
    sed -i '' 's/^\(sonar\.jdbc\.password\s*=\s*\).*$/\sonar\.jdbc\.password=sonar500/' ${RUNNERCONFIG}
    sed -i '' 's/^\(sonar\.jdbc\.url=\s*\).*$/\sonar\.jdbc\.url=jdbc:mysql:\/\/localhost:3306\/sonar500?useUnicode=true\&amp;characterEncoding=utf8/' ${RUNNERCONFIG}
    ;;
'dev')
    echo "set to dev mode"
    sed -i bak -e s/"public final static boolean IS_PROD = true;"/"public final static boolean IS_PROD = false;"/g ${PLUGINFILE}

    mvn clean license:format install
    rc=$?
    if [[ ${rc} != 0 ]] ; then
        echo 'Build error '; exit ${rc}
    else
        echo "deploy and restart sonar"
        cp ${ARTEFACT} ${DEPLOYDIR}
        ${START} restart
    fi

    echo "set back prod mode"
    cp ${PLUGINFILE}"bak" ${PLUGINFILE}
    rm ${PLUGINFILE}"bak"
    ;;

'stop')
    ${START} stop
    ;;

'prod')
    echo "build"

	mvn license:format clean install -PsecureRelease
	rc=$?
    if [[ ${rc} != 0 ]] ; then
        echo 'Build error '; exit ${rc}
    else
        echo "deploy and restart sonar"
        cp ${ARTEFACT} ${DEPLOYDIR}
        ${START} restart
    fi
	;;

*)
    echo "usage: $0 { init | dev | stop | prod }"
	;;

esac
exit 0