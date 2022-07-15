# public-gateway
welcome to public-gateway project～
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
type http://localhost:8080/graphql in your browser, then you will be redirected to apollo test server which also equals to https://studio.apollographql.com/sandbox/explorer, you can changed your server by edit sandbox box.
