FROM node:21.6.1-alpine

WORKDIR /usr/hls

COPY package*.json .

RUN npm i

COPY . .

ENV PORT 4000

EXPOSE $PORT

CMD [ "npm", "run", "start:dev" ]