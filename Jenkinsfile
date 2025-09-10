@Library('jenkins-shared-library') _

pipeline {
    agent any

    environment {
        DOCKERHUB_USERNAME = 'rehanshaikh1207'       
        IMAGE_TAG = "v${BUILD_NUMBER}"               // Version tag with build number
        DOCKER_HUB_CREDENTIALS = 'docker-hub-credentials' // Docker Hub credentials ID in Jenkins
        EMAIL_RECIPIENTS = 'ifrit1207@gmail.com'     // Email for notifications
    }

    stages {
        stage('Prepare Env File') {
            steps {
                script {
                    withCredentials([
                        string(credentialsId: 'mysql-root-password', variable: 'MYSQL_ROOT_PASSWORD'),
                        string(credentialsId: 'jwt-secret', variable: 'JWT_SECRET'),
                        string(credentialsId: 'db-password', variable: 'DB_PASSWORD') // Optional if different from root password
                    ]) {
                        writeFile file: '.env', text: """
MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
MYSQL_DATABASE=chattingo_db
SPRING_DATASOURCE_URL=jdbc:mysql://dbservice:3306/chattingo_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=${MYSQL_ROOT_PASSWORD}  # or ${DB_PASSWORD} if different
JWT_SECRET=${JWT_SECRET}
CORS_ALLOWED_ORIGINS=https://cloudwithrehan.in,https://www.cloudwithrehan.in
SPRING_PROFILES_ACTIVE=production
"""
                    }
                }
            }
        }

        stage('Clone Repository') {
            steps {
                gitClone()
            }
        }

        stage('Build Docker Images') {
            steps {
                dockerBuild(env.DOCKERHUB_USERNAME, env.IMAGE_TAG)
            }
        }

        stage('Scan Docker Image') {
            steps {
                parallelImageScan(env.DOCKERHUB_USERNAME, env.IMAGE_TAG)
            }
        }

        stage('Filesystem Scan') {
            steps {
                filesystemScan()
            }
        }

        stage('Push Docker Images') {
            steps {
                pushToRegistry(env.DOCKERHUB_USERNAME, env.IMAGE_TAG, env.DOCKER_HUB_CREDENTIALS)
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                sh 'docker-compose -f docker-compose.prod.yml up -d --build'
            }
        }
    }

    post {
        success {
            mail to: "${env.EMAIL_RECIPIENTS}",
                 subject: "SUCCESS: Build #${env.BUILD_NUMBER} - Chattingo",
                 body: "Build #${env.BUILD_NUMBER} completed successfully. Details: ${env.BUILD_URL}"
        }
        failure {
            mail to: "${env.EMAIL_RECIPIENTS}",
                 subject: "FAILURE: Build #${env.BUILD_NUMBER} - Chattingo",
                 body: "Build #${env.BUILD_NUMBER} failed. Check: ${env.BUILD_URL}"
        }
        always {
            cleanWs()
        }
    }
}
