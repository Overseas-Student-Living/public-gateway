import { registerEnumType } from "type-graphql";

export enum BillingCycle {
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
}

registerEnumType(BillingCycle, {
  name: "BillingCycle",
  description: "BillingCycle",
});
