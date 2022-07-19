import "reflect-metadata";
import { buildSchema } from "type-graphql";

import { GraphQLSchema } from "graphql";
import { typeResolvers } from "./services";
import { requirePermChecker } from "./decorators/permission";

function customCreateTypeDefsAndResolversMap(schema: GraphQLSchema) {
  return schema;
}

export async function generateTypeGraphqlSchema() {
  const schema = await buildSchema({
    // @ts-ignore
    resolvers: typeResolvers,
    authChecker: requirePermChecker,
    nullableByDefault: true
  });
  return customCreateTypeDefsAndResolversMap(schema);
}
