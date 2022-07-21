import * as moment from "moment";
import { GraphQLScalarType, StringValueNode } from "graphql";

function isValid(date) {
  const parsedDate = moment(date, "YYYY-MM", true);
  return parsedDate.isValid();
}

export const resolvers = {
  YearMonth: new GraphQLScalarType({
    name: "YearMonth",
    description: "Month in format ISO 8601 (YYYY-MM)",
    parseValue(value) {
      if (!isValid(value)) {
        throw new Error('invalid date format, should be "YYYY-MM"');
      }
      return value;
    },
    serialize(value) {
      return moment.utc(value).format("YYYY-MM");
    },
    parseLiteral(valueNode: StringValueNode) {
      if (!isValid(valueNode.value)) {
        throw new Error('invalid date format, should be "YYYY-MM"');
      }
      return valueNode.value;
    }
  })
};
