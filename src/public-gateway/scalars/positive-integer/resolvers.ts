import { GraphQLScalarType } from "graphql";

function isValid(value: number) {
  if (
    typeof value === "number" &&
    value >= 1 &&
    !value.toString().includes(".")
  ) {
    return true;
  }

  if (
    typeof value === "string" &&
    Number(value) >= 1 &&
    !String(value).includes(".")
  ) {
    return true;
  }
  return false;
}

export const resolvers = {
  PositiveInteger: new GraphQLScalarType({
    name: "PositiveInteger",
    description: "PositiveInteger is a integer(>=1).",
    parseValue(value) {
      if (!isValid(value)) {
        throw new Error(`invalid format, should be positive integer`);
      }
      return value;
    },
    serialize(value) {
      return value;
    },
    parseLiteral(valueNode: any) {
      if (Number(valueNode.value) > Math.pow(2, 31) - 1) {
        throw new Error(`out of integer range`);
      }
      if (!isValid(valueNode.value)) {
        throw new Error(`invalid format, should be positive integer`);
      }
      return valueNode.value;
    }
  })
};
