#!/usr/bin/env bash


docker stop sek9_ens_categorizer

yes | docker system prune

#git pull origin main

docker build -t sek9_ens_categorizer . -f Dockerfile

docker run \
  --name sek9_ens_categorizer \
  --network sek9 \
  --ip 172.20.0.5 \
  --hostname sek9_ens_categorizer \
  --dns=8.8.8.8 \
  -v ${PWD}:/app \
  -v /app/node_modules \
  -p 3000:3000 \
  -p 8545:8545 \
  -p 7545:7545 \
  -e CHOKIDAR_USEPOLLING=true \
  -d sek9_ens_categorizer

yes | docker system prune
