pipeline {
    agent any

    environment {
        DOCKER_COMPOSE = 'C:\\Users\\Vijayan\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin\\docker-compose.exe'
    }

    stages {

        // ==========================================
        // 1. CREATE ENVIRONMENT FILE
        // ==========================================
        stage('Create Environment File') {
            steps {
                echo '======================================'
                echo ' CREATING BACKEND ENVIRONMENT FILE'
                echo '======================================'

                bat '''
                    if exist backend\\.env del /f /q backend\\.env

                    (
                        echo MYSQL_SERVER=mariadb
                        echo MYSQL_HOST=mariadb
                        echo MYSQL_PORT=3306
                        echo MYSQL_USER=kintsugi
                        echo MYSQL_PASSWORD=kintsugi_pw
                        echo MYSQL_DB=kintsugi_db
                        echo MYSQL_DATABASE=kintsugi_db
                        echo DATABASE_URL=mysql+pymysql://kintsugi:kintsugi_pw@mariadb:3306/kintsugi_db
                        echo REDIS_URL=redis://redis:6379/1
                    ) > backend\\.env

                    echo.
                    echo Backend .env file created successfully.
                    echo.
                '''
            }
        }


        // ==========================================
        // 2. VERIFY DOCKER
        // ==========================================
        stage('Verify Docker') {
            steps {
                echo '======================================'
                echo ' VERIFYING DOCKER'
                echo '======================================'

                bat 'docker --version'

                bat '"%DOCKER_COMPOSE%" --version'
            }
        }


        // ==========================================
        // 3. VERIFY COMPOSE FILE
        // ==========================================
        stage('Verify Compose File') {
            steps {
                echo '======================================'
                echo ' VERIFYING DOCKER COMPOSE'
                echo '======================================'

                bat '"%DOCKER_COMPOSE%" config'
            }
        }


        // ==========================================
        // 4. BUILD DOCKER IMAGES
        // ==========================================
        stage('Build Docker Images') {
            steps {
                echo '======================================'
                echo ' BUILDING DOCKER IMAGES'
                echo '======================================'

                bat '"%DOCKER_COMPOSE%" build --no-cache'
            }
        }


        // ==========================================
        // 5. START DATABASE SERVICES
        // ==========================================
        stage('Start Database Services') {
            steps {
                echo '======================================'
                echo ' STARTING DATABASE SERVICES'
                echo '======================================'

                bat '"%DOCKER_COMPOSE%" up -d mariadb redis'

                echo 'MariaDB and Redis started successfully.'
            }
        }


        // ==========================================
        // 6. WAIT FOR DATABASE
        // ==========================================
        stage('Wait for Database') {
            steps {
                echo '======================================'
                echo ' WAITING FOR DATABASE'
                echo '======================================'

                bat '''
                    echo Waiting 20 seconds for MariaDB and Redis...
                    timeout /t 20 /nobreak
                '''

                bat '"%DOCKER_COMPOSE%" ps'
            }
        }


        // ==========================================
        // 7. CHECK DATABASE
        // ==========================================
        stage('Check Database') {
            steps {
                echo '======================================'
                echo ' CHECKING DATABASE CONNECTION'
                echo '======================================'

                bat '"%DOCKER_COMPOSE%" ps mariadb redis'

                bat '''
                    "%DOCKER_COMPOSE%" exec -T mariadb mariadb -ukintsugi -pkintsugi_pw -e "SELECT 1;"
                '''
            }
        }


        // ==========================================
        // 8. DATABASE MIGRATION
        // ==========================================
        stage('Database Migration') {
            steps {
                echo '======================================'
                echo ' RUNNING DATABASE MIGRATION'
                echo '======================================'

                echo 'Checking Alembic current revision...'

                bat '''
                    "%DOCKER_COMPOSE%" run --rm backend alembic current
                '''

                echo 'Running Alembic upgrade...'

                bat '''
                    "%DOCKER_COMPOSE%" run --rm backend alembic upgrade head
                '''
            }
        }


        // ==========================================
        // 9. START APPLICATION
        // ==========================================
        stage('Start Application') {
            steps {
                echo '======================================'
                echo ' STARTING APPLICATION'
                echo '======================================'

                bat '"%DOCKER_COMPOSE%" up -d backend celery-worker web'

                echo 'Backend started.'
                echo 'Celery worker started.'
                echo 'Web application started.'
            }
        }


        // ==========================================
        // 10. CHECK CONTAINERS
        // ==========================================
        stage('Check Containers') {
            steps {
                echo '======================================'
                echo ' CHECKING DOCKER CONTAINERS'
                echo '======================================'

                bat '"%DOCKER_COMPOSE%" ps'
            }
        }


        // ==========================================
        // 11. WAIT FOR APPLICATION
        // ==========================================
        stage('Wait for Application') {
            steps {
                echo '======================================'
                echo ' WAITING FOR APPLICATION'
                echo '======================================'

                bat '''
                    echo Waiting 15 seconds for application...
                    timeout /t 15 /nobreak
                '''

                bat '"%DOCKER_COMPOSE%" ps'
            }
        }


        // ==========================================
        // 12. APPLICATION TEST
        // ==========================================
        stage('Application Test') {
            steps {
                echo '======================================'
                echo ' TESTING APPLICATION'
                echo '======================================'

                echo 'Testing Backend...'

                bat '''
                    curl -f http://localhost:8000/ || exit /b 1
                '''

                echo 'Backend test passed.'

                echo 'Testing Web Application...'

                bat '''
                    curl -f http://localhost:3000/ || exit /b 1
                '''

                echo 'Web application test passed.'
            }
        }


        // ==========================================
        // 13. FINAL CHECK
        // ==========================================
        stage('Final Container Check') {
            steps {
                echo '======================================'
                echo ' FINAL CONTAINER STATUS'
                echo '======================================'

                bat '"%DOCKER_COMPOSE%" ps'
            }
        }
    }


    // ==============================================
    // POST ACTIONS
    // ==============================================
    post {

        success {
            echo '======================================'
            echo ' KINTSUGI DEPLOYMENT SUCCESSFUL'
            echo '======================================'

            bat '"%DOCKER_COMPOSE%" ps'

            echo '======================================'
            echo ' APPLICATION URLS'
            echo '======================================'

            echo 'Web Application: http://localhost:3000'
            echo 'Backend API:     http://localhost:8000'
        }


        failure {
            echo '======================================'
            echo ' KINTSUGI DEPLOYMENT FAILED'
            echo '======================================'

            echo 'Docker Container Status:'

            bat '''
                "%DOCKER_COMPOSE%" ps
            '''

            echo '--------------------------------------'
            echo ' MARIADB LOGS'
            echo '--------------------------------------'

            bat '''
                "%DOCKER_COMPOSE%" logs --tail=100 mariadb
            '''

            echo '--------------------------------------'
            echo ' REDIS LOGS'
            echo '--------------------------------------'

            bat '''
                "%DOCKER_COMPOSE%" logs --tail=100 redis
            '''

            echo '--------------------------------------'
            echo ' BACKEND LOGS'
            echo '--------------------------------------'

            bat '''
                "%DOCKER_COMPOSE%" logs --tail=100 backend
            '''

            echo '--------------------------------------'
            echo ' CELERY LOGS'
            echo '--------------------------------------'

            bat '''
                "%DOCKER_COMPOSE%" logs --tail=100 celery-worker
            '''

            echo '--------------------------------------'
            echo ' WEB LOGS'
            echo '--------------------------------------'

            bat '''
                "%DOCKER_COMPOSE%" logs --tail=100 web
            '''
        }


        always {
            echo '======================================'
            echo ' JENKINS PIPELINE FINISHED'
            echo '======================================'
        }
    }
}