def call() {
    stage('Deploy') {
        echo "Deploying to VPS..."
        sh """
            docker-compose -f docker-compose.prod.yml down || true
            docker-compose -f docker-compose.prod.yml up -d
        """
    }
}
