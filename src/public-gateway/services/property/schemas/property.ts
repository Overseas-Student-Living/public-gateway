import { MaxLength } from "class-validator";
import {
  Field,
  ID,
  Int,
  ObjectType,
  InputType,
  ArgsType,
  Directive,
  Float
} from "type-graphql";
import { resolvers as scalar } from "../../../scalars";
import { PageInfo } from "../../common";
import { BillingCycle, BookingJourney } from "../../enum";
import { ApartmentType, PropertyStatus } from "../enum";
import { PropertyFacilities } from "./facilities";

// ObjectType
@ObjectType()
export class Property {
  @Field(() => ID)
  id: string;
  @Field(() => String)
  name: string;
  @Field(() => String)
  slug: string;
  @Field(() => PropertyStatus, { nullable: false })
  status: PropertyStatus;
  @Field(() => Float)
  latitude: number;
  @Field(() => Float)
  longitude: number;
  @Field(() => ID)
  landlordId: string;
  @Field(() => ID)
  cityId: string;
  @Field(() => String)
  country: string;
  @Field(() => String, { nullable: false })
  currency: string;
  @Field(() => BillingCycle, { nullable: false })
  rentCycle: BillingCycle;
  @Field(() => BookingJourney, { nullable: false })
  bookingType: BookingJourney;

  @Field(() => String!)
  zipCode: string;
  @Field(() => String)
  address: string;
  @Field(() => String)
  addressLine2: string;

  @Field(() => ApartmentType, { nullable: false })
  apartmentType: ApartmentType;

  @Field(() => String)
  headlineCn: string;
  @Field(() => String)
  headline: string;
  @Field(() => String)
  descriptionCn: string;
  @Field(() => String)
  description: string;

  @Field(() => PropertyFacilities)
  facilities: PropertyFacilities;
}

@ObjectType()
export class CreatePropertyPayload {
  @Field(() => Property)
  property: Property;

  // TODO reviewlink
}

@ObjectType()
export class GetPropertyPayload {
  @Field(() => Property)
  property: Property[];
}

@ObjectType()
export class GetPropertiesPayload {
  @Field(() => PageInfo)
  pageInfo: PageInfo;
  @Field(() => [Property])
  properties: Property[];
}

// InputType
@InputType()
export class CreatePropertyInput {
  @Field(() => ApartmentType, { nullable: false })
  apartmentType: ApartmentType;

  @MaxLength(100)
  @Field(() => scalar.NonEmptyString, { nullable: false })
  name: string;

  @MaxLength(200)
  @Field(() => scalar.NonEmptyString, { nullable: false })
  address: string;

  @MaxLength(200)
  @Field(() => String)
  addressLine2: string;

  @MaxLength(10)
  @Field(() => scalar.NonEmptyString, { nullable: false })
  zipCode: string;

  @Directive('@decodeID(type: "City", required: true)')
  @Field(() => ID, { nullable: false })
  cityId: string;

  @Field(() => Float)
  latitude: number;

  @Field(() => Float)
  longitude: number;

  @MaxLength(400)
  @Field(() => String)
  headlineCn: string;

  @MaxLength(400)
  @Field(() => scalar.NonEmptyString, { nullable: false })
  headline: string;

  @MaxLength(400)
  @Field(() => String)
  descriptionCn: string;

  @MaxLength(400)
  @Field(() => scalar.NonEmptyString, { nullable: false })
  description: string;
}

// ArgsType
@ArgsType()
export class GetPropertiesArgs {
  @Field(() => Int)
  pageNumber: number = 1;
  @Field(() => Int)
  pageSize: number = 10;

  @Field(() => String)
  name: string;

  @Field(() => ApartmentType)
  apartmentType: ApartmentType;

  @Field(() => ID)
  cityId: string;

  @Field(() => String)
  country: string;

  @Field(() => BookingJourney)
  bookingType: BookingJourney;

  @Field(() => PropertyStatus)
  status: PropertyStatus;
}
