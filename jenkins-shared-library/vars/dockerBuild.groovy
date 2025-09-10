def call(String dockerRegistry, String imageTag) {
    stage('Docker Build') {
        echo "Building Docker images..."
        sh """
            docker build -t ${dockerRegistry}/chattingo-frontend:${imageTag} ./frontend
            docker build -t ${dockerRegistry}/chattingo-backend:${imageTag} ./backend
        """
    }
}
