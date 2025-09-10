def call() {
    stage('Git Clone') {
        echo "Cloning the repository"
        git branch: 'Docker-Implementation', url: 'https://github.com/rehanshaikh1207/chattingo.git'
        sh 'pwd && ls -la'
    }
}
