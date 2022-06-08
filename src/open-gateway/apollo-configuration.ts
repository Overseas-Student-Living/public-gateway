import { ApolloServer } from "apollo-server-express";
import { generateTypeGraphqlSchema } from "./type-graphql";

export async function generateApolloConfiguration() {
  const schema = await generateTypeGraphqlSchema();
  return {
    schema,
    introspection: true,
    debug: process.env.APOLLO_DEBUG === "true",
    plugins: []
  };
}

export const getApolloServer = async () => {
  const apolloConfiguration = await generateApolloConfiguration();
  return new ApolloServer(apolloConfiguration);
};
