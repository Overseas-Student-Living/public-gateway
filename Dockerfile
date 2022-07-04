FROM node:16.13.0-alpine

RUN apk add --no-cache openssl bash curl

USER node

RUN mkdir -p /home/node/app
WORKDIR /home/node/app

COPY package.json package.json
COPY node_modules node_modules
COPY dist dist
COPY wait-for-it.sh wait-for-it.sh
COPY manifest.json manifest.json

EXPOSE 8080

CMD ["yarn", "run", "start"]
