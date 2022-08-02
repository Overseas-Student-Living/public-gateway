import { GraphQLScalarType } from "graphql";

function isValid(value: string) {
  if (typeof value === "string" && value.trim().length >= 1) {
    return true;
  }
  return false;
}

export const resolvers = {
  NonEmptyString: new GraphQLScalarType({
    name: "NonEmptyString",
    description: "NonemptyString cannot be an empty string.",
    parseValue(value) {
      if (!isValid(value)) {
        throw new Error(`cannot be an empty string`);
      }
      return value;
    },
    serialize(value) {
      return value;
    },
    parseLiteral(valueNode: any) {
      if (!isValid(valueNode.value)) {
        throw new Error(`cannot be an empty string`);
      }
      return valueNode.value;
    },
  }),
};
