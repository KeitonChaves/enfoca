FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app/auth-service
COPY pom.xml /app/pom.xml
COPY auth-service/mvnw ./mvnw
COPY auth-service/.mvn ./.mvn
COPY auth-service/pom.xml ./pom.xml
RUN sed -i 's/\r$//' mvnw && chmod +x mvnw && ./mvnw dependency:go-offline
COPY auth-service/src ./src
RUN ./mvnw package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/auth-service/target/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
