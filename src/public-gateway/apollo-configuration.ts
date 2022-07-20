import { ApolloServer } from "apollo-server-express";
import { generateTypeGraphqlSchema } from "./type-graphql";
import { tracerRequestHandler, tracerResponseHandler } from "./middlewares";

const getApolloConfig = () => {
  if (process.env.APOLLO_ENGINE_API_KEY) {
    return {
      key: process.env.APOLLO_ENGINE_API_KEY,
      graphRef: `${process.env.APOLLO_ENGINE_API_KEY.split(":")[1]}@${(
        process.env.ENV || "stage"
      ).toLowerCase()}`
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
    context: ({ req, res }) => {
      tracerRequestHandler(req, res);
      return {
        req,
        res,
        rpc: req.rpc
      };
    },
    formatResponse(responseBody, gqlOptions) {
      tracerResponseHandler(
        gqlOptions.context.req,
        gqlOptions.context.res,
        null,
        {
          responseBody,
          responseStatus: responseBody.errors ? "error" : "success"
        }
      );
      return responseBody;
    }
  };
}

export const getApolloServer = async () => {
  const apolloConfiguration = await generateApolloConfiguration();
  return new ApolloServer(apolloConfiguration);
};
