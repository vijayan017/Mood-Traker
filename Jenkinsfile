pipeline {
    agent any

    environment {
        COMPOSE = 'C:\\Users\\Vijayan\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin\\docker-compose.exe'
    }

    stages {

        stage('Checkout') {
            steps {
                echo '======================================'
                echo ' CHECKING OUT SOURCE CODE'
                echo '======================================'

                checkout scm
            }
        }

        stage('Verify Tools') {
            steps {
                echo '======================================'
                echo ' VERIFYING DOCKER TOOLS'
                echo '======================================'

                bat 'docker --version'
                bat '"%COMPOSE%" --version'
            }
        }

        stage('Verify Compose File') {
            steps {
                echo '======================================'
                echo ' VERIFYING DOCKER COMPOSE CONFIGURATION'
                echo '======================================'

                bat '"%COMPOSE%" config'
            }
        }

        stage('Build Docker Images') {
            steps {
                echo '======================================'
                echo ' BUILDING DOCKER IMAGES'
                echo '======================================'

                bat '"%COMPOSE%" build'
            }
        }

        stage('Start Database Services') {
            steps {
                echo '======================================'
                echo ' STARTING MARIADB AND REDIS'
                echo '======================================'

                bat '"%COMPOSE%" up -d mariadb redis'
            }
        }

        stage('Wait for Database') {
            steps {
                echo 'Waiting for MariaDB and Redis...'

                bat '''
                    timeout /t 15 /nobreak
                '''

                bat '"%COMPOSE%" ps'
            }
        }

        stage('Start Application') {
            steps {
                echo '======================================'
                echo ' STARTING APPLICATION'
                echo '======================================'

                bat '"%COMPOSE%" up -d backend celery-worker web'
            }
        }

        stage('Check Containers') {
            steps {
                echo '======================================'
                echo ' CHECKING DOCKER CONTAINERS'
                echo '======================================'

                bat '"%COMPOSE%" ps'
            }
        }

        stage('Database Migration') {
            steps {
                echo '======================================'
                echo ' RUNNING DATABASE MIGRATION'
                echo '======================================'

                bat '"%COMPOSE%" exec -T backend alembic upgrade head'
            }
        }

        stage('Application Test') {
            steps {
                echo '======================================'
                echo ' TESTING APPLICATION'
                echo '======================================'

                bat '''
                    powershell -Command "try { $r=Invoke-WebRequest http://localhost:3000 -UseBasicParsing -TimeoutSec 20; Write-Host ('Web Status: ' + $r.StatusCode) } catch { Write-Host 'Web application is not responding'; exit 1 }"
                '''

                bat '''
                    powershell -Command "try { $r=Invoke-WebRequest http://localhost:8000 -UseBasicParsing -TimeoutSec 20; Write-Host ('Backend Status: ' + $r.StatusCode) } catch { Write-Host 'Backend application is not responding'; exit 1 }"
                '''
            }
        }
    }

    post {

        success {
            echo '======================================'
            echo ' KINTSUGI DEPLOYMENT SUCCESSFUL'
            echo '======================================'

            bat '"%COMPOSE%" ps'
        }

        failure {
            echo '======================================'
            echo ' KINTSUGI DEPLOYMENT FAILED'
            echo '======================================'

            bat '"%COMPOSE%" ps'

            bat '"%COMPOSE%" logs --tail=100 backend'

            bat '"%COMPOSE%" logs --tail=100 web'
        }

        always {
            echo '======================================'
            echo ' JENKINS PIPELINE FINISHED'
            echo '======================================'
        }
    }
}