def call() {
    withCredentials([
        string(credentialsId: 'mysql-root-password', variable: 'MYSQL_ROOT_PASSWORD'),
        string(credentialsId: 'jwt-secret', variable: 'JWT_SECRET'),
        string(credentialsId: 'db-password', variable: 'DB_PASSWORD')
    ]) {
        def envContent = """
MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
MYSQL_DATABASE=chattingo_db
SPRING_DATASOURCE_URL=jdbc:mysql://dbservice:3306/chattingo_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=${DB_PASSWORD}
JWT_SECRET=${JWT_SECRET}
CORS_ALLOWED_ORIGINS=https://cloudwithrehan.in,https://www.cloudwithrehan.in
CORS_ALLOWED_METHODS=GET,POST,PUT,DELETE,OPTIONS
CORS_ALLOWED_HEADERS=*
SPRING_PROFILES_ACTIVE=production
SERVER_PORT=8080
""".stripIndent().trim()

        writeFile file: '.env', text: envContent
        echo '.env file created in workspace'
    }
}
