import { GraphQLScalarType } from "graphql";

function isValid(value: number) {
  if (typeof value === "number" && value > 0) {
    return true;
  }

  if (typeof value === "string" && Number(value) > 0) {
    return true;
  }
  return false;
}

export const resolvers = {
  Positive: new GraphQLScalarType({
    name: "Positive",
    description: "Positive is a number(>0).",
    parseValue(value) {
      if (!isValid(value)) {
        throw new Error(`invalid format, should be Positive number`);
      }
      return value;
    },
    serialize(value) {
      return value;
    },
    parseLiteral(valueNode: any) {
      if (!isValid(valueNode.value)) {
        throw new Error(`invalid format, should be Positive number`);
      }
      return valueNode.value;
    },
  }),
};
