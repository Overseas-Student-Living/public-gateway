import "reflect-metadata";
import { buildSchema } from "type-graphql";

import { GraphQLSchema } from "graphql";
import { SchemaDirectiveVisitor } from "graphql-tools";
import { typeResolvers } from "./services";
import { requirePermChecker } from "./decorators/permission";
import { schemaDirectives } from "./directives";

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
  SchemaDirectiveVisitor.visitSchemaDirectives(schema, schemaDirectives);

  return customCreateTypeDefsAndResolversMap(schema);
}
