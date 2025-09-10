def call() {
    stage('Deploy') {
        echo "Deploying to VPS..."
        sh """
            cd $WORKSPACE
            docker-compose -f docker-compose.prod.yml down || true
            docker-compose -f docker-compose.prod.yml up -d
        """
    }
}
