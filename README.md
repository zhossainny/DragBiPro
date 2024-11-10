# DragBiPro

https://www.youtube.com/watch?v=1aU3g2b_ma4

To Run Manually:
npm install then run

npm start
Browser: localhost:3500

**** Docker Hub has these created already ************************ https://hub.docker.com/u/zhossainny ********************************************************
DOCKER RUN:
for Docker to run Spring backend and Mongo together (-d deamon mode)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
docker network create app-network
docker run -d --name dragbi_mongo --network app-network -p 27017:27017 mongo:latest
docker run -d --network app-network -p 9002:9002 zhossainny/spring-mongo-dragbi-backend-1.0.0.jar
docker run -d -p 3500:3500 zhossainny/drag-bi-react-app:1.0.0
 
~~~~~~~~~~~~~~~~~~~~~~ One Line to Run All ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
docker network create app-network && docker run -d --name dragbi_mongo --network app-network -p 27017:27017 mongo:latest && docker run -d --network app-network -p 9002:9002 zhossainny/spring-mongo-dragbi-backend-1.0.0.jar && docker run -d --network app-network -p 9104:9104 zhossainny/restapi-latest:latest && docker run -d --network app-network -p 3500:3500 zhossainny/drag-bi-react-app:1.0.0


~~~~~~~~~~~~~~~~~~~~~~~~~~~ TO REMOVE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
for /F "tokens=*" %i in ('docker ps -q --filter "network=app-network"') do docker stop %i 
docker network rm app-network && docker rm -f dragbi_mongo

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ TROUBLE SHOOT ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
docker rm -f dragbi_mongo (if already created)
docker network ls 
docker network rm app-network
docker build -t zhossainny/restapi-latest:latest . (to build a new one)
