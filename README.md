# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.
- Docker Desktop - [Download & Install Docker](https://www.docker.com/products/docker-desktop/).

## Downloading
```
git clone https://github.com/BayanAlex/nodejs2024Q1-service
```

## Please follow the procedure for installing and testing
1. `npm run app:init` This script will install and init everything and run app and postgres in docker containers. **Wait for app to start**.
2. `npm run test` This script can be run inside *rest-service:hls* container or in the local folder of the project.
3. `npm run docker:scan:hls` This script will scan app image for vulnerabilities using built-in Docker Scout Cves tool. If you don't have it for some reason, please install https://github.com/docker/scout-cli.

Use `npm run docker:start` and `npm run docker:stop` for running and stopping containers.