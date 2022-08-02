import { GraphQLScalarType } from "graphql";

function isValid(value: number) {
  if (typeof value === "number" && value >= 0) {
    return true;
  }

  if (typeof value === "string" && Number(value) >= 0) {
    return true;
  }
  return false;
}

export const resolvers = {
  NonNegative: new GraphQLScalarType({
    name: "NonNegative",
    description: "NonNegative is a number(>=0).",
    parseValue(value) {
      if (!isValid(value)) {
        throw new Error(`invalid format, should be NonNegative number`);
      }
      return value;
    },
    serialize(value) {
      return value;
    },
    parseLiteral(valueNode: any) {
      if (!isValid(valueNode.value)) {
        throw new Error(`invalid format, should be NonNegative number`);
      }
      return valueNode.value;
    },
  }),
};
