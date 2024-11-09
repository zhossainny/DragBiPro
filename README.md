# DragBiPro

https://www.youtube.com/watch?v=1aU3g2b_ma4

npm install then run
npm start

Browser: localhost:3500

DOCKER RUN:
for Docker to run Spring backend and Mongo together (-d deamon mode)
docker run -d -p 3500:3500 zhossainny/drag-bi-react-app:1.0.0
docker network create app-network
docker run -d --name dragbi_mongo --network app-network -p 27017:27017 mongo:latest
docker run -d --network app-network -p 9002:9002 zhossainny/spring-mongo-dragbi-backend-1.0.0.jar

trouble shoot:
docker rm -f dragbi_mongo (if already created)
