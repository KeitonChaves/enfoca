FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app/metrics-service
COPY pom.xml /app/pom.xml
COPY metrics-service/mvnw ./mvnw
COPY metrics-service/.mvn ./.mvn
COPY metrics-service/pom.xml ./pom.xml
RUN sed -i 's/\r$//' mvnw && chmod +x mvnw && ./mvnw dependency:go-offline
COPY metrics-service/src ./src
RUN ./mvnw package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/metrics-service/target/*.jar app.jar
EXPOSE 8083
ENTRYPOINT ["java", "-jar", "app.jar"]
