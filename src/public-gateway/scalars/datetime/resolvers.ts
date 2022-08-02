import * as moment from "moment";
import { GraphQLScalarType, StringValueNode } from "graphql";

const fullFormat = "YYYY-MM-DDTHH:mm:ssZ";

const acceptedFormats = [
  "YYYY-MM-DD HH:mm:ss",
  "YYYY-MM-DDTHH:mm:ss",
  "YYYY-MM-DD",
  fullFormat,
];

function isValid(date) {
  const parsedDate = moment(date, acceptedFormats, true);
  return parsedDate.isValid();
}

export const resolvers = {
  Datetime: new GraphQLScalarType({
    name: "Datetime",
    description: "Datetime in format (YYYY-MM-DDTHH:mm:ssZ)",
    parseValue(value) {
      if (!isValid(value)) {
        throw new Error(
          `invalid date format, should be one of ${acceptedFormats}`
        );
      }
      return moment.utc(value, acceptedFormats, true).format(fullFormat);
    },
    serialize(value) {
      return moment.utc(value).format(fullFormat);
    },
    parseLiteral(valueNode: StringValueNode) {
      if (!isValid(valueNode.value)) {
        throw new Error(
          `invalid date format, should be one of ${acceptedFormats}`
        );
      }
      return moment
        .utc(valueNode.value, acceptedFormats, true)
        .format(fullFormat);
    },
  }),
};
