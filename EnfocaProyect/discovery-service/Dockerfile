FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app/discovery-service
COPY pom.xml /app/pom.xml
COPY discovery-service/mvnw ./mvnw
COPY discovery-service/.mvn ./.mvn
COPY discovery-service/pom.xml ./pom.xml
RUN sed -i 's/\r$//' mvnw && chmod +x mvnw && ./mvnw dependency:go-offline
COPY discovery-service/src ./src
RUN ./mvnw package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/discovery-service/target/*.jar app.jar
EXPOSE 8761
ENTRYPOINT ["java", "-jar", "app.jar"]
