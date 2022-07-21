import * as moment from "moment";
import { GraphQLScalarType, StringValueNode } from "graphql";

function isValid(date) {
  const parsedDate = moment(date, "YYYY-MM-DD", true);
  return parsedDate.isValid();
}

export const resolvers = {
  Date: new GraphQLScalarType({
    name: "Date",
    description: "Date in format ISO 8601 (YYYY-MM-DD)",
    parseValue(value) {
      if (!isValid(value)) {
        throw new Error('invalid date format, should be "YYYY-MM-DD"');
      }
      return value;
    },
    serialize(value) {
      return moment.utc(value).format("YYYY-MM-DD");
    },
    parseLiteral(valueNode: StringValueNode) {
      if (!isValid(valueNode.value)) {
        throw new Error('invalid date format, should be "YYYY-MM-DD"');
      }
      return valueNode.value;
    }
  })
};
