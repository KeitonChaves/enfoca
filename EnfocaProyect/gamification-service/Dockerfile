FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app/gamification-service
COPY pom.xml /app/pom.xml
COPY gamification-service/mvnw ./mvnw
COPY gamification-service/.mvn ./.mvn
COPY gamification-service/pom.xml ./pom.xml
RUN sed -i 's/\r$//' mvnw && chmod +x mvnw && ./mvnw dependency:go-offline
COPY gamification-service/src ./src
RUN ./mvnw package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/gamification-service/target/*.jar app.jar
EXPOSE 8088
ENTRYPOINT ["java", "-jar", "app.jar"]
