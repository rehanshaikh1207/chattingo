def call() {
    stage('Filesystem Scan') {
        echo "Scanning cloned repository with Trivy..."
        sh """
            trivy fs --no-progress --severity HIGH,CRITICAL --format table --scanners vuln ${env.WORKSPACE} || true
            echo "File system scan completed."
        """
    }
}
