FROM openjdk:19-alpine
EXPOSE 9104
ADD target/restapi-latest.jar restapi-latest.jar
ENTRYPOINT ["java","-jar","/restapi-latest.jar"]