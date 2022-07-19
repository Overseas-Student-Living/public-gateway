import "reflect-metadata";
import { buildSchema } from "type-graphql";

import { GraphQLSchema } from "graphql";
import { typeResolvers } from "./services";

function customCreateTypeDefsAndResolversMap(schema: GraphQLSchema) {
  return schema;
}

export async function generateTypeGraphqlSchema() {
  const schema = await buildSchema({
    // @ts-ignore
    resolvers: typeResolvers,
    nullableByDefault: true
  });
  return customCreateTypeDefsAndResolversMap(schema);
}
