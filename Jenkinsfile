pipeline {
    agent any
    tools {
        maven 'Maven 3.5'
        jdk 'JDK 8'
        nodejs 'NodeJS 10'
    }
    stages {
        stage('Prepare') {
            steps {
                deleteDir()
                checkout scm
            }
        }

        stage('Build') {
            steps {
                script {
                    env.CHROME_BIN = '/usr/bin/chromium-browser'
                    configFileProvider([configFile(fileId: 'maven-settings', variable: 'MAVEN_SETTINGS')]) {
                        sh 'mvn -s $MAVEN_SETTINGS clean license:check package -PcleanAll,ci -U -B'
                    }

                    // publish frontend coverage html
                    publishHTML(target: [
                            allowMissing         : false,
                            alwaysLinkToLastBuild: true,
                            keepAll              : true,
                            reportDir            : 'softvis3d-frontend/coverage',
                            reportFiles          : 'index.html',
                            reportName           : "Frontend test coverage Report"])
                }
            }
        }

        stage('Sonar') {
            steps {
                script {
                    withSonarQubeEnv('SonarQube SoftVis3D') {
                        if (env.BRANCH_NAME == "master") {
                            sh 'mvn sonar:sonar -Dsonar.host.url=$SONAR_HOST_URL -Dsonar.login=$SONAR_AUTH_TOKEN'
                        } else {
                            sh 'mvn sonar:sonar -Dsonar.host.url=$SONAR_HOST_URL -Dsonar.login=$SONAR_AUTH_TOKEN -Dsonar.projectKey=de.rinderle.softvis3d:softvis3d:$BRANCH_NAME -Dsonar.projectName=softvis3d:$BRANCH_NAME'
                        }
                    }
                }
            }
        }

        stage('Verify') {
            steps {
                script {
                    sh 'mvn failsafe:integration-test'
                }
            }
        }
    }

    post {
        changed {
            sendNotification buildChanged: true
        }
        failure {
            sendNotification buildChanged: false
        }
    }
}