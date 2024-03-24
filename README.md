# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads)
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager
- Docker Desktop - [Download & Install Docker](https://www.docker.com/products/docker-desktop/)

## Downloading
```
git clone https://github.com/BayanAlex/nodejs2024Q1-service
```

## Please follow the procedure for installing and testing
### Before testing
1. Login into your Docker account in Docker Desktop. This is needed for vulnerabilities testing.
2. Make sure that you don't have running any other containers and software that can use app port and Postgres ext port configured in .env.
3. For clean check please stop all other containers and remove unnecessary volumes in Docker.

### Testing
1. `npm run app:init` This script will install and init everything and run app and Postgres in docker containers. **Wait for app to start**.
2. `npm run test` This script can be run inside *rest-service:hls* container or in the local folder of the project.
3. `npm run docker:scan:hls` This script will scan app image for vulnerabilities using built-in Docker Scout Cves tool. If you don't have it for some reason, please install https://github.com/docker/scout-cli.
4. Do other checks according to scoring.
5. Uploaded images you can find here: https://hub.docker.com/repository/docker/alexshigida/rest-service/general.

Use `npm run docker:start` and `npm run docker:stop` for running and stopping containers.