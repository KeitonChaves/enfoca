FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app/pomodoro-service
COPY pom.xml /app/pom.xml
COPY pomodoro-service/mvnw ./mvnw
COPY pomodoro-service/.mvn ./.mvn
COPY pomodoro-service/pom.xml ./pom.xml
RUN sed -i 's/\r$//' mvnw && chmod +x mvnw && ./mvnw dependency:go-offline
COPY pomodoro-service/src ./src
RUN ./mvnw package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/pomodoro-service/target/*.jar app.jar
EXPOSE 8082
ENTRYPOINT ["java", "-jar", "app.jar"]
