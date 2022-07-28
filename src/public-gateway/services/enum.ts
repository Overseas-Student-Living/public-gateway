import { registerEnumType } from "type-graphql";

export enum BillingCycle {
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly"
}

registerEnumType(BillingCycle, {
  name: "BillingCycle",
  description: "BillingCycle"
});

export enum BookingJourney {
  MANUAL = "manual",
  SEMI_AUTOMATIC = "semi_automatic",
  FULL_AUTOMATIC = "full_automatic",
  INSTANT_BOOK = "instant_book"
}

registerEnumType(BookingJourney, {
  name: "BookingJourney",
  description: "Booking Journey"
});

export enum DiscountType {
  ABSOLUTE = "absolute",
  PERCENTAGE = "percentage"
}

registerEnumType(DiscountType, {
  name: "DiscountType",
  description: "Discount Type"
});
