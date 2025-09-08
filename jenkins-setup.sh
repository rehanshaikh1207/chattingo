#!/bin/bash

# Jenkins Setup Script for Chattingo Hackathon
echo "Setting up Jenkins for Chattingo deployment..."

# Install Jenkins on Ubuntu
sudo apt update
sudo apt install -y openjdk-11-jdk

# Add Jenkins repository
wget -q -O - https://pkg.jenkins.io/debian-stable/jenkins.io.key | sudo apt-key add -
sudo sh -c 'echo deb https://pkg.jenkins.io/debian-stable binary/ > /etc/apt/sources.list.d/jenkins.list'

# Install Jenkins
sudo apt update
sudo apt install -y jenkins

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker jenkins
sudo usermod -aG docker $USER

# Start Jenkins
sudo systemctl start jenkins
sudo systemctl enable jenkins

# Install required Jenkins plugins
echo "Jenkins is starting... Please wait 2 minutes then access http://your-server-ip:8080"
echo "Initial admin password:"
sudo cat /var/lib/jenkins/secrets/initialAdminPassword

echo ""
echo "Required Jenkins Credentials to create:"
echo "1. docker-hub-credentials (Username/Password)"
echo "2. vps-ssh-credentials (SSH Username with Private Key)"
echo ""
echo "Required Jenkins Plugins:"
echo "- Docker Pipeline"
echo "- SSH Agent"
echo "- Pipeline: Stage View"
echo "- Blue Ocean (optional)"
