pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/imedjadli-dev/devops-formation-frontend.git'
            }
        }

        stage('Trivy Repository Scan') {
        steps {
        sh '''
            echo "================================="
            echo "     TRIVY REPOSITORY SCAN"
            echo "================================="

            trivy repo \
                --timeout 10m \
                https://github.com/imedjadli-dev/devops-formation-frontend
        '''
    }
}

        stage('Install dependencies') {
            steps {
                sh 'node -v'
                sh 'npm ci'
            }
        }

        stage('Lint') {
            steps {
                sh 'npm run lint || true'
            }
        }

stage('Test') {
    steps {
        sh 'npm test -- --watch=false --coverage'
    }
    post {
        always {
            junit 'test-results/junit.xml'
        }
    }
}

        stage('Trivy Scan (Filesystem)') {
            steps {
            sh '''
            trivy fs --severity HIGH,CRITICAL --exit-code 0 --format table -o trivy-fs-report.txt .
            '''
            }
            post {
            always {
            archiveArtifacts artifacts: 'trivy-fs-report.txt', allowEmptyArchive: true
        }
    }
}

       stage('SonarQube Analysis') {
    steps {
        withSonarQubeEnv('SonarQube') {
            sh '''
                echo "SONAR_HOST_URL=$SONAR_HOST_URL"
                echo "Token present: $([ -n "$SONAR_AUTH_TOKEN" ] && echo yes || echo no)"
                npm run sonar -- -Dsonar.host.url=$SONAR_HOST_URL -Dsonar.token=$SONAR_AUTH_TOKEN
            '''
        }
    }
}

        stage('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }





        stage('Build') {
            steps {
                sh 'npm run build -- --configuration production'
            }
        }

               stage('Publish to Nexus') {
    environment {
        NEXUS_URL = 'http://127.0.0.1:8081'
    }
    steps {
        withCredentials([usernamePassword(credentialsId: 'nexus-creds', usernameVariable: 'NEXUS_USER', passwordVariable: 'NEXUS_PASS')]) {
            sh '''
                cd dist
                ZIP_NAME="devops-formation-frontend-${BUILD_NUMBER}.zip"
                zip -r ../$ZIP_NAME .
                cd ..
                curl -v -u $NEXUS_USER:$NEXUS_PASS \
                    --upload-file $ZIP_NAME \
                    $NEXUS_URL/repository/frontend-releases/$ZIP_NAME
            '''
        }
    }
}

        stage('Archive artifacts') {
            steps {
                archiveArtifacts artifacts: 'dist/**/*', fingerprint: true
            }
        }

        stage('Deploy') {
            environment {
                NEXUS_URL = 'http://127.0.0.1:8081'
            }
            steps {
                withCredentials([usernamePassword(credentialsId: 'nexus-creds', usernameVariable: 'NEXUS_USER', passwordVariable: 'NEXUS_PASS')]) {
                    sh '''
                        cd /Users/imedjadli/ansible-workshop
                        /opt/homebrew/bin/ansible-playbook -i inventory.ini site.yml \
                          -e "app_env=prod" \
                          -e "build_number=${BUILD_NUMBER}" \
                          -e "nexus_url=${NEXUS_URL}" \
                          -e "zip_name=devops-formation-frontend-${BUILD_NUMBER}.zip"
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'Build et archivage réussis :white_tick:'
        }
        failure {
            echo 'Le pipeline a échoué :x:'
        }
    }
}