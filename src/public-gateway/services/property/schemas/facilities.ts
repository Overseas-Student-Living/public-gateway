import { Field, ID, InputType, ObjectType } from "type-graphql";
import { FacilityType } from "../enum";

@ObjectType()
export class Facility {
  @Field(() => String)
  slug: string;
  @Field(() => String)
  label: string;
  @Field(() => String)
  name: string;
  @Field(() => String)
  group: string;
  @Field(() => FacilityType)
  type: FacilityType;
}

@ObjectType()
export class GetFacilitiesPayload {
  @Field(() => [Facility])
  features: Facility[];
  @Field(() => [Facility])
  bills: Facility[];
  @Field(() => [Facility])
  security_and_safety: Facility[];
  @Field(() => [Facility])
  property_rules: Facility[];
}

@InputType()
export class UpdatePropertyFacilitiesInput {
  @Field(() => ID)
  propertyId: string;
  @Field(() => [String])
  facilitySlugs: string[];
}

@ObjectType()
export class UpdatePropertyFacilitiesPayload {
  @Field(() => Boolean)
  success: boolean;
}
