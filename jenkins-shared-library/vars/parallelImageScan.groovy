def call(String dockerRegistry, String imageTag) {
    stage('Parallel Image Scan') {
        parallel(
            "Scan Frontend Image": {
                echo "Scanning frontend Docker image..."
                sh "trivy image --no-progress --severity HIGH,CRITICAL ${dockerRegistry}/chattingo-frontend:${imageTag} || true"
            },
            "Scan Backend Image": {
                echo "Scanning backend Docker image..."
                sh "trivy image --no-progress --severity HIGH,CRITICAL ${dockerRegistry}/chattingo-backend:${imageTag} || true"
            }
        )
    }
}
