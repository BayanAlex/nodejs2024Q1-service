FROM node:21.7.1-alpine

WORKDIR /usr/hls

COPY package*.json .

RUN npm i

COPY . .

RUN npx prisma generate

ENV PORT 4000

EXPOSE $PORT

CMD [ "npm", "run", "start:dev" ]