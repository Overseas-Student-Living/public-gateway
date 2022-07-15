# public-gateway

welcome to public-gateway project ～

Default server:
 - prod: https://public-gateway.student.com/graphql
 - stage: https://public-gateway.dandythrust.com/graphql
 - uat1: https://public-gateway-uat1.dandythrust.com/graphql
 - localhost: http://localhost:8080/graphql

# 一、Installation

### Prerequisites

Node: install version 16.13.0 or greater https://nodejs.org/en/download/

Yarn: https://yarnpkg.com/lang/en/docs/install/

### Pull project code

> Clone https://github.com/Overseas-Student-Living/public-gateway
>
> cd /path/to/repo to go into the project root

### Installation dependencies

> yarn install

> cp .env.dist .env => already install an package called dotenv to load config file from local .env

# 二、Basic commands

## 1、run project

> make develop

## 2. Test your api

Local:
    type http://localhost:8080/graphql in your browser, then you will be redirected to apollo test server which also equals to https://studio.apollographql.com/sandbox/explorer, you can changed your server by edit sandbox box.

Remote:
    Type https://studio.apollographql.com/sandbox/explorer in your browser, then changed the server to your remote server.
    For example I want to test uat1 server, so I type https://public-gateway-uat1.dandythrust.com/graphql in my sandbox.

# Attention:

1. Before call a remote rpc api, we recommend you to add the rpc api in you type `RpcContext` to ensure the api is valid.
