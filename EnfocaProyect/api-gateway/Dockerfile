FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app/api-gateway
COPY pom.xml /app/pom.xml
COPY api-gateway/mvnw ./mvnw
COPY api-gateway/.mvn ./.mvn
COPY api-gateway/pom.xml ./pom.xml
RUN sed -i 's/\r$//' mvnw && chmod +x mvnw && ./mvnw dependency:go-offline
COPY api-gateway/src ./src
RUN ./mvnw package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/api-gateway/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
