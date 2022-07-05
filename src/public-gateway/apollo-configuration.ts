import { ApolloServer } from "apollo-server-express";
import { generateTypeGraphqlSchema } from "./type-graphql";

const getApolloConfig = () => {
  if (process.env.APOLLO_ENGINE_API_KEY) {
    return {
      key: process.env.APOLLO_ENGINE_API_KEY,
      graphRef: `${process.env.APOLLO_ENGINE_API_KEY.split(':')[1]}@${(
        process.env.ENV || 'stage'
      ).toLowerCase()}`,
    };
  }
  return undefined;
};

export async function generateApolloConfiguration() {
  const schema = await generateTypeGraphqlSchema();
  return {
    schema,
    introspection: true,
    debug: process.env.APOLLO_DEBUG === "true",
    apollo: getApolloConfig(),
    plugins: [],
    context: ({ req, res }) => ({
      req,
      res,
      rpc: req.rpc
    })
  };
}

export const getApolloServer = async () => {
  const apolloConfiguration = await generateApolloConfiguration();
  return new ApolloServer(apolloConfiguration);
};
