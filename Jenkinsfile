pipeline {
    agent any

    options {
        timestamps()
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }

        stage('Verify Tools') {
            steps {
                bat 'docker --version'
                bat 'docker compose version'
            }
        }

        stage('Build Docker Images') {
            steps {
                echo 'Building Docker images...'
                bat 'docker compose build'
            }
        }

        stage('Start Application') {
            steps {
                echo 'Starting Kintsugi application...'
                bat 'docker compose up -d'
            }
        }

        stage('Database Migration') {
            steps {
                echo 'Running database migrations...'
                bat 'docker compose exec -T backend alembic upgrade head'
            }
        }

        stage('Check Containers') {
            steps {
                echo 'Checking Docker containers...'
                bat 'docker compose ps'
            }
        }

        stage('Application Test') {
            steps {
                echo 'Testing application...'
                bat 'curl.exe -f http://localhost:3000'
            }
        }
    }

    post {
        success {
            echo '======================================'
            echo ' KINTSUGI DEPLOYMENT SUCCESSFUL'
            echo ' Application: http://localhost:3000'
            echo '======================================'
        }

        failure {
            echo '======================================'
            echo ' KINTSUGI DEPLOYMENT FAILED'
            echo '======================================'
            bat 'docker compose ps'
            bat 'docker compose logs --tail=100 backend'
            bat 'docker compose logs --tail=100 web'
        }
    }
}