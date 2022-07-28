import { registerEnumType } from "type-graphql";

export enum ListingType {
  FIXED = "fixed",
  FIXED_OPEN_END = "fixed-open-end",
  FLEXIBLE = "flexible",
  FLEXIBLE_OPEN_END = "flexible-open-end",
  PLACEHOLDER = "placeholder",
  NOT_SPECIFIC = "not-specific"
}

registerEnumType(ListingType, {
  name: "ListingType",
  description: "Listing Type"
});

export enum MoveInType {
  EXACTLY_MATCH = "exactly_match",
  AFTER = "after",
  ANYTIME = "anytime"
}

registerEnumType(MoveInType, {
  name: "MoveInType",
  description: "MoveInType"
});

export enum MoveOutType {
  EXACTLY_MATCH = "exactly_match",
  BEFORE = "before",
  ANYTIME = "anytime"
}

registerEnumType(MoveOutType, {
  name: "MoveOutType",
  description: "MoveOutType"
});

export enum TenancyLengthType {
  EQUALS = "equals",
  NO_LESS_THAN = "no_less_than",
  NO_MORE_THAN = "no_more_than",
  BETWEEN = "between",
  NOT_SPECIFIC = "not_specific"
}

registerEnumType(TenancyLengthType, {
  name: "TenancyLengthType",
  description: "TenancyLengthType"
});
