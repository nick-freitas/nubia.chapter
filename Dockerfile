FROM node:alpine

WORKDIR /app
COPY package.json .
RUN yarn --only=prod
COPY . .

CMD yarn run start:dev
