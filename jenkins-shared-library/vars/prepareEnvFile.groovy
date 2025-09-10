def call() {
    withCredentials([
        string(credentialsId: 'mysql-root-password', variable: 'MYSQL_ROOT_PASSWORD'),
        string(credentialsId: 'jwt-secret', variable: 'JWT_SECRET'),
        string(credentialsId: 'db-password', variable: 'DB_PASSWORD') // optional, if used
    ]) {
        writeFile file: '.env', text: """
MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
MYSQL_DATABASE=chattingo_db
SPRING_DATASOURCE_URL=jdbc:mysql://dbservice:3306/chattingo_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=${MYSQL_ROOT_PASSWORD}  // or ${DB_PASSWORD} if different
JWT_SECRET=${JWT_SECRET}
CORS_ALLOWED_ORIGINS=https://cloudwithrehan.in,https://www.cloudwithrehan.in
SPRING_PROFILES_ACTIVE=production
"""
    }
}
