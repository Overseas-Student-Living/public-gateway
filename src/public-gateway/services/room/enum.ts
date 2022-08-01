import { registerEnumType } from "type-graphql";

export enum RoomCategory {
  ENSUITE_ROOM = "ensuite-room",
  ENTIRE_PLACE = "entire-place",
  PRIVATE_ROOM = "private-room",
  SHARED_ROOM = "shared-room",
  STUDIO = "studio"
}

registerEnumType(RoomCategory, {
  name: "RoomCategory"
});

export enum RoomSizeUnit {
  SQM = "sqm",
  SQFT = "sqft"
}

registerEnumType(RoomSizeUnit, {
  name: "RoomSizeUnit"
});

export enum BedSizeType {
  UNIFIED = "unified",
  DIFFERENT = "different"
}

registerEnumType(BedSizeType, {
  name: "BedSizeType"
});

export enum DualOccupancy {
  DUAL_OCCUPANCY_ALLOWED = "dual_occupancy_allowed",
  FREE_DUAL_OCCUPANCY = "free_dual_occupancy",
  CHARGED_DUAL_OCCUPANCY = "charged_dual_occupancy",
  DUAL_OCCUPANCY_NOT_ALLOWED = "dual_occupancy_not_allowed"
}

registerEnumType(DualOccupancy, {
  name: "DualOccupancy"
});

export enum BathroomTypeCategory {
  PRIVATE_ENSUITE = "private-ensuite",
  PRIVATE_NON_ENSUITE = "private-non-ensuite",
  SHARED_ENSUITE = "shared-ensuite",
  SHARED_NON_ENSUITE = "shared-non-ensuite",
  MIXED = "mixed"
}

registerEnumType(BathroomTypeCategory, {
  name: "BathroomTypeCategory"
});

export enum KitchenArrangement {
  PRIVATE = "private",
  SHARED = "shared"
}

registerEnumType(KitchenArrangement, {
  name: "KitchenArrangement"
});

export enum GenderMix {
  MALE_ONLY = "male-only",
  FEMALE_ONLY = "female-only",
  MIXED = "mixed"
}

registerEnumType(GenderMix, {
  name: "GenderMix"
});

export enum DietaryPreference {
  VEGETARIAN = "vegetarian"
}

registerEnumType(DietaryPreference, {
  name: "DietaryPreference"
});

export enum SmokingPreference {
  NON_SMOKING = "non-smoking",
  SMOKING = "smoking"
}

registerEnumType(SmokingPreference, {
  name: "SmokingPreference"
});

export enum BedType {
  SINGLE_BED = "single_bed",
  DOUBLE_BED = "double_bed",
  SMALL_DOUBLE_BED = "small_double_bed",
  KING_BED = "king_bed",
  KING_SINGLE_BED = "king_single_bed",
  CALIFORNIA_KING_BED = "california_king_bed",
  GRAND_KING_BED = "grand_king_bed",
  QUEEN_BED = "queen_bed",
  KING_SIZE_BED = "king_size_bed",
  TWIN_BED = "twin_bed",
  BUNK_BED = "bunk_bed"
}

registerEnumType(BedType, {
  name: "BedType"
});

export enum RoomSizeType {
  EXACT = "exact",
  BETWEEN = "between",
  MORE_THAN = "more_than"
}

registerEnumType(RoomSizeType, {
  name: "RoomSizeType"
});
