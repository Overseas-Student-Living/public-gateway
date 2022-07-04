FROM node:16.13.0-alpine

RUN apk add --no-cache openssl bash curl

USER node

RUN mkdir -p /home/node/app
WORKDIR /home/node/app

COPY package.json package.json
COPY node_modules node_modules
COPY dist dist

EXPOSE 8080

CMD ["yarn", "run", "start"]
