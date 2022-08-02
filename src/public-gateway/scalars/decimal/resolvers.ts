import { Decimal } from "decimal.js";
import { GraphQLScalarType, Kind } from "graphql";

export const decimalResolvers = {
  Decimal: new GraphQLScalarType({
    name: "Decimal",
    description: "The `Decimal` scalar type to represent currency values",

    serialize(value) {
      return value.toString();
    },

    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) {
        throw new TypeError(
          // @ts-ignore | TS2339
          `${String(ast.value)} is not a valid decimal value.`
        );
      }
      return new Decimal(ast.value);
    },

    parseValue(value) {
      return new Decimal(value);
    },
  }),
};
