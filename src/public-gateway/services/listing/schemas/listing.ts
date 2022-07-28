import { resolvers as scalar } from "../../../scalars";
import {
  ArgsType,
  Directive,
  Field,
  ID,
  InputType,
  Int,
  ObjectType
} from "type-graphql";
import { DiscountType } from "../../enum";
import { MoveInType, MoveOutType, TenancyLengthType } from "../enum";
import { PageInfo } from "../../common";

@ObjectType()
export class Discount {
  @Field(() => DiscountType)
  discountType: DiscountType;
  @Field(() => String)
  discountValue: string;
}

@ObjectType()
export class Tenancy {
  @Field(() => scalar.Date)
  moveIn: Date;
  @Field(() => scalar.Date)
  moveOut: Date;
  @Field(() => MoveInType)
  moveInType: MoveInType;
  @Field(() => MoveOutType)
  moveOutType: MoveOutType;

  @Field(() => TenancyLengthType)
  tenancyLengthType: TenancyLengthType;
  @Field(() => [Int])
  tenancyLengthValue: [number];
}

@ObjectType()
export class RateAvailability {
  @Field(() => ID, { nullable: false })
  id: string;

  @Field(() => ID, { nullable: false })
  roomId: string;

  @Field(() => Tenancy)
  tenancy: Tenancy;

  // 对应db字段live_on，live_until
  @Field(() => scalar.Date)
  bookableFrom: Date;
  @Field(() => scalar.Date)
  bookableTo: Date;

  @Field(() => String)
  priceMin: string;
  @Field(() => String)
  priceMax: string;

  @Field(() => Discount)
  discount: Discount;

  // @Field(() => ListingType)
  // type: ListingType;
}

@ObjectType()
export class GetRateAvailabilityPayload {
  @Field(() => RateAvailability)
  rateAvailability: RateAvailability;
}

@ObjectType()
export class GetRateAvailabilitiesPayload {
  @Field(() => PageInfo)
  pageInfo: PageInfo;
  @Field(() => [RateAvailability])
  rateAvailabilities: RateAvailability[];
}

@ArgsType()
export class GetRateAvailabilityArgs {
  @Field(() => Int)
  pageNumber: number = 1;
  @Field(() => Int)
  pageSize: number = 100;
  @Field(() => ID)
  roomId: string;
}

@ObjectType()
export class CreateRateAvailabilityPayload {
  @Field(() => RateAvailability)
  rateAvailability: RateAvailability;
}

@ObjectType()
export class UpdateRateAvailabilityPayload {
  @Field(() => RateAvailability)
  rateAvailability: RateAvailability;
}

@ObjectType()
export class DeleteRateAvailabilityPayload {
  @Field(() => Boolean)
  result: Boolean;
}

@InputType()
export class DiscountInput {
  @Field(() => DiscountType, { nullable: false })
  discountType: DiscountType;
  @Field(() => String, { nullable: false })
  discountValue: string;
}

@InputType()
export class TenancyInput {
  @Field(() => scalar.Date, { nullable: false })
  moveIn: Date;
  @Field(() => scalar.Date)
  moveOut: Date;
  @Field(() => MoveInType, { nullable: false })
  moveInType: MoveInType;
  @Field(() => MoveOutType, { nullable: false })
  moveOutType: MoveOutType;

  @Field(() => TenancyLengthType, { nullable: false })
  tenancyLengthType: TenancyLengthType;
  @Field(() => [Int])
  tenancyLengthValue: [number];
}

@InputType()
export class CreateRateAvailabilityInput {
  @Directive('@decodeID(type: "Room", required: true)')
  @Field(() => ID, { nullable: false })
  roomId: string;

  @Field(() => scalar.Date, { nullable: false })
  bookableFrom: Date;
  @Field(() => scalar.Date, { nullable: false })
  bookableTo: Date;

  @Field(() => TenancyInput, { nullable: false })
  tenancy: TenancyInput;

  @Field(() => DiscountInput, { nullable: false })
  discount: DiscountInput;

  @Field(() => scalar.NonEmptyString, { nullable: false })
  priceMin: string;
  @Field(() => String)
  priceMax: string;
}

@InputType()
export class UpdateRateAvailabilityInput {
  @Directive('@decodeID(type: "RateAvailability", required: true)')
  @Field(() => ID, { nullable: false })
  id: string;

  @Field(() => scalar.Date)
  bookableFrom: Date;
  @Field(() => scalar.Date)
  bookableTo: Date;

  @Field(() => TenancyInput)
  tenancy: TenancyInput;

  @Field(() => DiscountInput)
  discount: DiscountInput;

  @Field(() => scalar.NonEmptyString)
  priceMin: string;
  @Field(() => String)
  priceMax: string;
}

@InputType()
export class DeleteRateAvailabilityInput {
  @Directive('@decodeID(type: "RateAvailability", required: true)')
  @Field(() => ID)
  id: string;
}
