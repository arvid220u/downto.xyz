#!/usr/bin/env bash

docker build -t downto .
docker tag downto registry.digitalocean.com/arvid/downto
docker push registry.digitalocean.com/arvid/downto

printf "FIRST TIME SETUP:\n\t1. ssh root@api.downto.xyz\n\t2. copy over setup_server.sh and run it\n\t3. copy over docker-compose.yml\n\t4. copy over run_server.sh and run it\n\nNEW UPDATE:\n\t1. ssh root@api.downto.xyz\n\t2. ./run_server.sh"
