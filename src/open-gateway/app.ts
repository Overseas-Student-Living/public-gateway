import * as express from "express";
import middlewares from "./middlewares";
import { kinopio } from "./middlewares/rpc";

import { getApolloServer } from "./apollo-configuration";

const app = express();

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
  await server.start();
  server.applyMiddleware({ app });

  return app;
}
