import * as express from "express";
import { getApolloServer } from "./apollo-configuration";

const app = express();

export async function createApp() {
  const server = await getApolloServer();

  await server.start();
  server.applyMiddleware({ app });

  return app;
}
