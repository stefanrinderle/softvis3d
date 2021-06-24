pipeline {
    agent any
    stages {
        stage("Git Checkout") {
            steps {
                script {
                    deleteDir()
                    checkout([
                            $class                           : 'GitSCM',
                            branches                         : [[name: "master"]],
                            doGenerateSubmoduleConfigurations: false,
                            userRemoteConfigs                : [[
                                                                        credentialsId: 'github',
                                                                        url          : 'https://github.com/stefanrinderle/softvis3d'
                                                                ]]
                    ])

                }
            }
        }
        stage('Deploy') {
            steps {
                script {
                    sh """
                      cd docs
                      export DOCKER_TLS_VERIFY="1"
                      export DOCKER_HOST="tcp://202.61.243.117:2376"
                      export DOCKER_CERT_PATH="/var/lib/jenkins/machine/rindernetProd"
                      export DOCKER_MACHINE_NAME="rindernetProd"
                      docker-compose build
                      docker-compose up -d
                 """
                }
            }
        }
    }

}