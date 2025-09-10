def call(String dockerRegistry, String imageTag, String credentialsId) {
    stage('Push to Registry') {
        echo "Pushing to Docker registry..."
        withCredentials([usernamePassword(credentialsId: credentialsId, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
            sh """
                echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin
                docker push ${dockerRegistry}/chattingo-frontend:${imageTag}
                docker push ${dockerRegistry}/chattingo-backend:${imageTag}
                docker logout
            """
        }
    }
}
