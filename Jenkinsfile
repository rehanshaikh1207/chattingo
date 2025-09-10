pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = 'rehanshaikh1207'
        IMAGE_TAG = "v${BUILD_NUMBER}"
        DOCKER_HUB_CREDENTIALS = credentials('docker-hub-credentials')
    }

    stages {
        stage('Git Clone') {
            steps {
                echo "cloning the repository"
                git branch: 'Docker-Implementation', url: 'https://github.com/rehanshaikh1207/chattingo.git'
                sh 'pwd && ls -la'
            }
        }

        stage('Docker Build') {
            steps {
                echo "Building Docker images..."
                sh """
                    docker build -t ${DOCKER_REGISTRY}/chattingo-frontend:${IMAGE_TAG} ./frontend
                    docker build -t ${DOCKER_REGISTRY}/chattingo-backend:${IMAGE_TAG} ./backend
                """
            }
        }

        stage('Filesystem Scan') {
            steps {
                echo "Scanning cloned repository with Trivy..."
                sh """
                    trivy fs --no-progress --severity HIGH,CRITICAL --format table --scanners vuln ${WORKSPACE} || true
                    echo "File system scan completed."
                """
            }
        }

        stage('Image Scan') {
            steps {
                echo "Scanning Docker images for vulnerabilities...make sure trivy is installed in the system"
                sh '''
                  # Scan frontend image
                  trivy image --no-progress --severity HIGH,CRITICAL ${DOCKER_REGISTRY}/chattingo-frontend:${IMAGE_TAG} || true

                  # Scan backend image
                  trivy image --no-progress --severity HIGH,CRITICAL ${DOCKER_REGISTRY}/chattingo-backend:${IMAGE_TAG} || true

                  echo "Image scan completed."
                '''
            }
        }

        stage('Push to Registry') {
            steps {
                echo "Pushing to registry..."
                withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials',
                                                usernameVariable: 'DOCKER_USER',
                                                passwordVariable: 'DOCKER_PASS')]) {
                    sh """
                        echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin
                        docker push ${DOCKER_REGISTRY}/chattingo-frontend:${IMAGE_TAG}
                        docker push ${DOCKER_REGISTRY}/chattingo-backend:${IMAGE_TAG}
                        docker logout
                    """
                }
            }
        }

        stage('Update Compose') {
            steps {
                echo "Updating compose file..."
                sh """
                    sed -i 's|:latest|:${IMAGE_TAG}|g' docker-compose.prod.yml
                    cat docker-compose.prod.yml
                """
            }
        }

        stage('Deploy') {
            steps {
                echo "Deploying to VPS..."
                sh """
                    docker-compose -f docker-compose.prod.yml down || true
                    docker-compose -f docker-compose.prod.yml up -d
                """
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
