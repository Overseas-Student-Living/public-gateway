import { registerEnumType } from "type-graphql";

export enum ApartmentType {
  HOTEL_HOSTEL = "hotel-hostel",
  LONG_TAIL = "long-tail",
  MULTI_FAMILy = "multi-family",
  REAL = "real-estate",
  STUDENT_ACCOMMODATION = "student-accommodation",
  CO_LIVING = "co-living",
  APARTMENTS = "apartments",
  HMO = "hmo",
  HOUSE_SHARE = "house-share",
  HOME_STAY = "home-stay",
  STUDENT_RESIDENCE_HALLS = "student-residence-halls",
  DORMITORY = "dormitory",
  PURPOSE_BUILT_STUDENT_ACCOMMODATION = "purpose-built-student-accommodation",
  HOUSE = "house",
  HOSTEL = "hostel",
  HOTEL = "hotel",
  APART_HOTEL = "apart-hotel",
  MULTIFAMILY = "multifamily",
  LODGE = "lodge",
  CONDOS = "condos",
  TOWNHOUSE_HOME = "townhouse-home",
  BUNGALOW = "bungalow",
  TERRACE = "terrace",
  VILLA = "villa",
  SERVICED_APARTMENT = "serviced-apartment",
  DUPLEX = "duplex",
}

registerEnumType(ApartmentType, {
  name: "ApartmentType",
  description: "ApartmentType",
});

export enum PropertyStatus {
  NEW = "new",
  EDITING = "editing",
  PUBLISHED = "published",
  UNPUBLISHED = "unpublished",
}

registerEnumType(PropertyStatus, {
  name: "PropertyStatus",
});

export enum PropertyTermStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  EXPIRED = "expired",
}

registerEnumType(PropertyTermStatus, {
  name: "PropertyTermStatus",
});

export enum FreeCancellationPeriod {
  HOURS_24 = "24_hours",
  HOURS_48 = "48_hours",
  HOURS_72 = "72_hours",
  BUSINESS_DAYS_5 = "5_business_days",
  CALENDAR_DAYS_0 = "0_calendar_days",
  CALENDAR_DAYS_3 = "3_calendar_days",
  CALENDAR_DAYS_5 = "5_calendar_days",
  CALENDAR_DAYS_7 = "7_calendar_days",
  CALENDAR_DAYS_14 = "14_calendar_days",
  CALENDAR_DAYS_28 = "28_calendar_days",
  CALENDAR_DAYS_30 = "30_calendar_days",
  CALENDAR_DAYS_60 = "60_calendar_days",
  CALENDAR_DAYS_90 = "90_calendar_days",
  UNTIL_CHECK_IN_DAY = "until_check_in_day",
  UNTIL_THE_STUDENT_PAYS_FOR_THE_RENT = "until_the_student_pays_for_the_rent",
  NO_COOLING_OFF_PERIOD = "no_cooling_off_period",
  OTHER = "other",
}

registerEnumType(FreeCancellationPeriod, {
  name: "FreeCancellationPeriod",
});

export enum FacilityType {
  PROPERTY = "property",
  UNIT_TYPE = "unit_type",
}

registerEnumType(FacilityType, { name: "FacilityType" });
