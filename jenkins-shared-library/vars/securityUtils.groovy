def scanFilesystem() {
    echo "Starting filesystem security scan..."
    
    // Check for sensitive files
    sh '''
        echo "Scanning for sensitive files..."
        find . -name "*.key" -o -name "*.pem" -o -name "id_rsa*" | head -10
        
        echo "Checking for hardcoded secrets..."
        grep -r "password\\|secret\\|key" --include="*.java" --include="*.js" . | grep -v ".git" | head -5 || true
        
        echo "Filesystem scan completed"
    '''
}

def scanImage(imageName) {
    echo "Scanning image: ${imageName}"
    
    script {
        try {
            // Using Trivy for vulnerability scanning
            sh "docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy:latest image --exit-code 0 --severity HIGH,CRITICAL ${imageName}"
            echo "Image scan completed for ${imageName}"
        } catch (Exception e) {
            echo "Image scan failed for ${imageName}: ${e.getMessage()}"
            // Continue pipeline even if scan fails
        }
    }
}
