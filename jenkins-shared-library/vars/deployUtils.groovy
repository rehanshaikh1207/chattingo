def updateComposeFile(imageTag) {
    echo "Updating docker-compose.yml with new image tags..."
    
    sh """
        sed -i 's|image: .*chattingo-frontend.*|image: ${DOCKER_REGISTRY}/chattingo-frontend:${imageTag}|g' docker-compose.prod.yml || true
        sed -i 's|image: .*chattingo-backend.*|image: ${DOCKER_REGISTRY}/chattingo-backend:${imageTag}|g' docker-compose.prod.yml || true
        
        echo "Updated docker-compose.prod.yml:"
        cat docker-compose.prod.yml
    """
}

def deployToVPS() {
    echo "Deploying to VPS..."
    
    // Copy files to VPS
    sh '''
        scp -o StrictHostKeyChecking=no docker-compose.prod.yml $VPS_CREDENTIALS_USR@your-vps-ip:/home/$VPS_CREDENTIALS_USR/
        scp -o StrictHostKeyChecking=no .env $VPS_CREDENTIALS_USR@your-vps-ip:/home/$VPS_CREDENTIALS_USR/
    '''
    
    // Deploy on VPS
    sh '''
        ssh -o StrictHostKeyChecking=no $VPS_CREDENTIALS_USR@your-vps-ip "
            cd /home/$VPS_CREDENTIALS_USR
            docker-compose -f docker-compose.prod.yml down || true
            docker-compose -f docker-compose.prod.yml pull
            docker-compose -f docker-compose.prod.yml up -d
            docker-compose -f docker-compose.prod.yml ps
        "
    '''
    
    echo "Deployment to VPS completed"
}
