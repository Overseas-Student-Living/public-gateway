import { resolvers as scalar } from "../../../scalars";
import {
  ArgsType,
  Directive,
  Field,
  Float,
  ID,
  InputType,
  Int,
  ObjectType
} from "type-graphql";
import {
  BathroomTypeCategory,
  BedSizeType,
  DietaryPreference,
  DualOccupancy,
  GenderMix,
  KitchenArrangement,
  SmokingPreference,
  RoomCategory,
  BedType,
  RoomSizeUnit,
  RoomSizeType
} from "../enum";
import { Facility } from "../../property/schemas/facilities";
import { PageInfo } from "../../common";

@ObjectType()
export class BedSize {
  // @Field(() => Int, { nullable: false })
  // id: number;
  @Field(() => BedType)
  bedType: BedType;
  @Field(() => Int)
  lengthInCM: number;
  @Field(() => Int)
  widthInCM: number;
  @Field(() => Int)
  bedCount: number;
}

@ObjectType()
export class RoomSize {
  @Field(() => RoomSizeType)
  descriptor: RoomSizeType;
  @Field(() => Int, { nullable: false })
  minimum: number;
  @Field(() => Int)
  maximum: number;
  @Field(() => RoomSizeUnit)
  unitOfArea: RoomSizeUnit;
}

@ObjectType()
export class Room {
  @Field(() => ID, { nullable: false })
  id: string;
  @Field(() => String, { nullable: false })
  name: string;
  // @Field(() => Property)
  // property: Property;
  @Field(() => ID, { nullable: false })
  propertyId: string;
  @Field(() => RoomCategory, { nullable: false })
  category: RoomCategory;
  @Field(() => Int)
  bedCount: number;
  @Field(() => Float)
  bathroomCount: number;
  @Field(() => BathroomTypeCategory)
  bathroomType: BathroomTypeCategory;
  @Field(() => Float)
  kitchenCount: number;
  @Field(() => Int)
  bedroomCountMin: number;
  @Field(() => Int)
  bedroomCountMax: number;
  @Field(() => Int)
  maxOccupancy: number;
  @Field(() => GenderMix)
  genderMix: GenderMix;
  @Field(() => DietaryPreference)
  dietaryPreference: DietaryPreference;
  @Field(() => SmokingPreference)
  smokingPreference: SmokingPreference;
  @Field(() => [Int], { nullable: true })
  floors: number[];
  @Field(() => DualOccupancy)
  dualOccupancy: DualOccupancy;
  @Field(() => KitchenArrangement)
  kitchenArrangement: KitchenArrangement;
  @Field(() => scalar.YearMonth)
  lastFurnished: string;

  // 定义一些room.facilities的枚举是不是更好
  @Field(() => [Facility], { nullable: false })
  facilities: Facility[];

  @Field(() => RoomSize)
  roomSize: RoomSize;

  @Field(() => BedSizeType)
  bedSizeType: BedSizeType;

  @Field(() => [BedSize], { nullable: true })
  bedSizes: BedSize[];
}


@ObjectType()
export class GetRoomPayload {
  @Field(() => Room)
  room: Room;
}
@ObjectType()
export class GetRoomsPayload {
  @Field(() => PageInfo)
  pageInfo: PageInfo;
  @Field(() => [Room])
  rooms: Room[];
}

@ArgsType()
export class GetRoomArgs {
  @Field(() => Int)
  pageNumber: number = 1;
  @Field(() => Int)
  pageSize: number = 100;
  @Field(() => ID)
  propertyId: string;
}

@ObjectType()
export class CreateRoomPayload {
  @Field(() => Room)
  room: Room;
}

@ObjectType()
export class UpdateRoomPayload {
  @Field(() => Room)
  room: Room;
}

@ObjectType()
export class DeleteRoomPayload {
  @Field(() => Boolean)
  result: Boolean;
}

@InputType()
export class BedSizesInput {
  @Field(() => BedType)
  bedType: BedType;
  @Field(() => scalar.PositiveInteger)
  lengthInCM: number;
  @Field(() => scalar.PositiveInteger)
  widthInCM: number;
  @Field(() => scalar.NaturalNumber)
  bedCount: number;
}

@InputType()
export class RoomSizesInput {
  @Field(() => RoomSizeType)
  descriptor: RoomSizeType;
  @Field(() => Int, { nullable: false })
  minimum: number;
  @Field(() => Int, { nullable: false })
  maximum: number;
  @Field(() => RoomSizeUnit)
  unitOfArea: RoomSizeUnit;
}

@InputType()
export class CreateRoomInput {
  @Directive('@decodeID(type: "Property", required: true)')
  @Field(() => ID, { nullable: false })
  propertyId: string;
  @Field(() => scalar.NonEmptyString, { nullable: false })
  name: string;
  @Field(() => RoomCategory, { nullable: false })
  category: RoomCategory;
  @Field(() => scalar.NaturalNumber, { nullable: false })
  bedCount: number;
  @Field(() => [Int], { nullable: true })
  floors: number[];
  @Field(() => scalar.NaturalNumber)
  maxOccupancy: number;
  @Field(() => DualOccupancy)
  dualOccupancy: DualOccupancy;
  @Field(() => BathroomTypeCategory, { nullable: false })
  bathroomType: BathroomTypeCategory;
  @Field(() => KitchenArrangement)
  kitchenArrangement: KitchenArrangement;
  @Field(() => scalar.NaturalNumber)
  bedroomCountMin: number;
  @Field(() => scalar.NaturalNumber)
  bedroomCountMax: number;
  @Field(() => Float)
  bathroomCount: number;
  @Field(() => Float)
  kitchenCount: number;
  @Field(() => GenderMix)
  genderMix: GenderMix;
  @Field(() => DietaryPreference)
  dietaryPreference: DietaryPreference;
  @Field(() => SmokingPreference)
  smokingPreference: SmokingPreference;

  @Field(() => [String])
  facilities: string[];

  @Field(() => BedSizeType, { nullable: false })
  bedSizeType: BedSizeType;
  @Field(() => [BedSizesInput])
  bedSizes: BedSizesInput[];

  @Field(() => RoomSizesInput)
  roomSize: RoomSizesInput;
}

@InputType()
export class UpdateRoomInput {
  @Directive('@decodeID(type: "UnitType", required: true)')
  @Field(() => ID, { nullable: false })
  id: string;
  @Field(() => scalar.NonEmptyString)
  name: string;
  @Field(() => RoomCategory)
  category: RoomCategory;
  @Field(() => scalar.NaturalNumber)
  bedCount: number;
  @Field(() => [Int])
  floors: number[];
  @Field(() => scalar.NaturalNumber)
  maxOccupancy: number;
  @Field(() => DualOccupancy)
  dualOccupancy: DualOccupancy;
  @Field(() => BathroomTypeCategory)
  bathroomType: BathroomTypeCategory;
  @Field(() => KitchenArrangement)
  kitchenArrangement: KitchenArrangement;
  @Field(() => scalar.NaturalNumber)
  bedroomCountMin: number;
  @Field(() => scalar.NaturalNumber)
  bedroomCountMax: number;
  @Field(() => Float)
  bathroomCount: number;
  @Field(() => Float)
  kitchenCount: number;
  @Field(() => GenderMix)
  genderMix: GenderMix;
  @Field(() => DietaryPreference)
  dietaryPreference: DietaryPreference;
  @Field(() => SmokingPreference)
  smokingPreference: SmokingPreference;

  @Field(() => [String])
  facilities: string[];

  @Field(() => BedSizeType)
  bedSizeType: BedSizeType;
  @Field(() => [BedSizesInput])
  bedSizes: BedSizesInput[];

  @Field(() => RoomSizesInput)
  roomSize: RoomSizesInput;
}

@InputType()
export class DeleteRoomInput {
  @Directive('@decodeID(type: "UnitType", required: true)')
  @Field(() => ID)
  id: string;
}
