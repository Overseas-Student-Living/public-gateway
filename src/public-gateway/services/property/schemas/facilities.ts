import { Directive, Field, ID, InputType, ObjectType } from "type-graphql";
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
export class PropertyFacility extends Facility {
  @Field(() => Boolean)
  checked: boolean;
}

@ObjectType()
export class PropertyFacilities {
  @Field(() => [PropertyFacility])
  features: PropertyFacility[];
  @Field(() => [PropertyFacility])
  bills: PropertyFacility[];
  @Field(() => [PropertyFacility])
  securityAndSafety: PropertyFacility[];
  @Field(() => [PropertyFacility])
  propertyRules: PropertyFacility[];
}

@ObjectType()
export class GetFacilitiesPayload {
  @Field(() => [Facility])
  features: Facility[];
  @Field(() => [Facility])
  bills: Facility[];
  @Field(() => [Facility])
  securityAndSafety: Facility[];
  @Field(() => [Facility])
  propertyRules: Facility[];
}

@InputType()
export class UpdatePropertyFacilitiesInput {
  @Directive('@decodeID(type: "Property", required: true)')
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
