FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app/ai-service
COPY pom.xml /app/pom.xml
COPY ai-service/mvnw ./mvnw
COPY ai-service/.mvn ./.mvn
COPY ai-service/pom.xml ./pom.xml
RUN sed -i 's/\r$//' mvnw && chmod +x mvnw && ./mvnw dependency:go-offline
COPY ai-service/src ./src
RUN ./mvnw package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/ai-service/target/*.jar app.jar
EXPOSE 8085
ENTRYPOINT ["java", "-jar", "app.jar"]
