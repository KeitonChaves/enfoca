FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app/certification-service
COPY pom.xml /app/pom.xml
COPY certification-service/mvnw ./mvnw
COPY certification-service/.mvn ./.mvn
COPY certification-service/pom.xml ./pom.xml
RUN sed -i 's/\r$//' mvnw && chmod +x mvnw && ./mvnw dependency:go-offline
COPY certification-service/src ./src
RUN ./mvnw package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/certification-service/target/*.jar app.jar
EXPOSE 8086
ENTRYPOINT ["java", "-jar", "app.jar"]
