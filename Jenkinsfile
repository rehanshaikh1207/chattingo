@Library('chattingo-shared-lib') _

pipeline {
    agent any
    
    environment {
        DOCKER_HUB_CREDENTIALS = credentials('docker-hub-credentials')
        VPS_CREDENTIALS = credentials('vps-ssh-credentials')
        DOCKER_REGISTRY = 'your-dockerhub-username'
        IMAGE_TAG = "${BUILD_NUMBER}"
    }
    
    stages {
        stage('Git Clone') {
            steps {
                script {
                    gitUtils.cloneRepository()
                }
            }
        }
        
        stage('Image Build') {
            parallel {
                stage('Build Frontend') {
                    steps {
                        script {
                            dockerUtils.buildImage('frontend', './frontend', "${DOCKER_REGISTRY}/chattingo-frontend:${IMAGE_TAG}")
                        }
                    }
                }
                stage('Build Backend') {
                    steps {
                        script {
                            dockerUtils.buildImage('backend', './backend', "${DOCKER_REGISTRY}/chattingo-backend:${IMAGE_TAG}")
                        }
                    }
                }
            }
        }
        
        stage('Filesystem Scan') {
            steps {
                script {
                    securityUtils.scanFilesystem()
                }
            }
        }
        
        stage('Image Scan') {
            parallel {
                stage('Scan Frontend Image') {
                    steps {
                        script {
                            securityUtils.scanImage("${DOCKER_REGISTRY}/chattingo-frontend:${IMAGE_TAG}")
                        }
                    }
                }
                stage('Scan Backend Image') {
                    steps {
                        script {
                            securityUtils.scanImage("${DOCKER_REGISTRY}/chattingo-backend:${IMAGE_TAG}")
                        }
                    }
                }
            }
        }
        
        stage('Push to Registry') {
            steps {
                script {
                    dockerUtils.pushToRegistry([
                        "${DOCKER_REGISTRY}/chattingo-frontend:${IMAGE_TAG}",
                        "${DOCKER_REGISTRY}/chattingo-backend:${IMAGE_TAG}"
                    ])
                }
            }
        }
        
        stage('Update Compose') {
            steps {
                script {
                    deployUtils.updateComposeFile(IMAGE_TAG)
                }
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    deployUtils.deployToVPS()
                }
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        success {
            echo 'Deployment successful!'
        }
        failure {
            echo 'Deployment failed!'
        }
    }
}
