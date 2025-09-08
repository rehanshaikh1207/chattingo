def buildImage(serviceName, contextPath, imageName) {
    echo "Building ${serviceName} image..."
    sh "docker build -t ${imageName} ${contextPath}"
    echo "${serviceName} image built successfully: ${imageName}"
}

def pushToRegistry(imageList) {
    echo "Logging into Docker Hub..."
    sh 'echo $DOCKER_HUB_CREDENTIALS_PSW | docker login -u $DOCKER_HUB_CREDENTIALS_USR --password-stdin'
    
    imageList.each { image ->
        echo "Pushing ${image}..."
        sh "docker push ${image}"
    }
    
    echo "All images pushed successfully"
    sh 'docker logout'
}
