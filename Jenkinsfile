pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps { checkout scm }
        }
        stage('Docker Build') {
            steps { sh 'docker build -t transitgo:${BUILD_NUMBER} .' }
        }
        stage('Deploy') {
            steps {
                sh '''
                    docker rm -f transitgo-container || true
                    docker run -d --name transitgo-container --restart unless-stopped -p 5002:5000 transitgo:${BUILD_NUMBER}
                '''
            }
        }
        stage('Smoke Test') {
            steps { sh 'sleep 3; curl --fail http://localhost:5002/health' }
        }
    }
}
