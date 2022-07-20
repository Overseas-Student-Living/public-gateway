import * as express from "express";
import middlewares from "./middlewares";
import { kinopio } from "./middlewares/rpc";

import { getApolloServer } from "./apollo-configuration";
import { getLogger } from "./logger";

const app = express();
const log = getLogger("app");

export async function createApp() {
  const server = await getApolloServer();
  await kinopio.connect();

  middlewares.forEach(item => {
    if (Array.isArray(item)) {
      app.use(...item);
    } else {
      app.use(item);
    }
  });

  app.get("/healthcheck", (_, res) => {
    kinopio
      .healthcheck()
      .then(response => {
        res.send(response);
      })
      .catch(error => {
        log.error("catch healthcheck error: %s", error.stack);
        res.status(503).send(error);
      });
  });

  await server.start();
  server.applyMiddleware({ app });

  return app;
}
