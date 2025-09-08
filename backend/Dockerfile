# Stage 1: Maven build environment
FROM maven:3.9.4-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Extract JAR layers for optimization
FROM eclipse-temurin:17-jre-alpine AS layers
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Stage 3: Runtime with distroless image
FROM gcr.io/distroless/java17-debian11
WORKDIR /app
COPY --from=layers /app/app.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
