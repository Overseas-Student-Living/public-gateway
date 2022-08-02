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
  NaturalNumber: new GraphQLScalarType({
    name: "NaturalNumber",
    description: "NaturalNumber is a integer(>=0).",
    parseValue(value) {
      if (!isValid(value)) {
        throw new Error(`invalid format, should be natural number`);
      }
      return value;
    },
    serialize(value) {
      return value;
    },
    parseLiteral(valueNode: any) {
      if (!isValid(valueNode.value)) {
        throw new Error(`invalid format, should be natural number`);
      }
      return valueNode.value;
    },
  }),
};
