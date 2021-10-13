#!/usr/bin/env bash

docker build -t downto .
docker tag downto registry.digitalocean.com/arvid/downto
docker push registry.digitalocean.com/arvid/downto

echo "ssh root@api.downto.xyz, install docker, log in to the registry, install docker-compose, copy over docker-compose.yml, run docker-compose up -d, docker pull registry.digitalocean.com/arvid/downto"
