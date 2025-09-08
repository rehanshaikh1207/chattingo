def cloneRepository() {
    echo "Cloning repository..."
    checkout scm
    sh 'git clean -fdx'
    sh 'git status'
    echo "Repository cloned successfully"
}
