import { merge } from "lodash";

import { resolvers as dateResolvers } from "./date/resolvers";
import { resolvers as verifyDateResolvers } from "./verify-date/resolvers";
import { resolvers as dateTimeResolvers } from "./datetime/resolvers";
import { resolvers as jsonResolvers } from "./json/resolvers";
import { resolvers as yearMonthResolvers } from "./year-month/resolvers";
import { resolvers as positiveResolvers } from "./positive/resolvers";
import { resolvers as positiveIntegerResolvers } from "./positive-integer/resolvers";
import { resolvers as naturalNumberResolvers } from "./natural/resolvers";
import { resolvers as nonEmptyStringResolvers } from "./nonempty-string/resolvers";
import { resolvers as nonNegativeResolvers } from "./nonnegative/resolvers";
import { decimalResolvers } from "./decimal/resolvers";

export const resolvers = merge(
  verifyDateResolvers,
  dateTimeResolvers,
  jsonResolvers,
  yearMonthResolvers,
  positiveResolvers,
  positiveIntegerResolvers,
  naturalNumberResolvers,
  nonEmptyStringResolvers,
  nonNegativeResolvers,
  dateResolvers,
  yearMonthResolvers,
  decimalResolvers
);
