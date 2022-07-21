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
  DUPLEX = "duplex"
}

registerEnumType(ApartmentType, {
  name: "ApartmentType",
  description: "ApartmentType"
});

export enum PropertyStatus {
  NEW = "new",
  EDITING = "editing",
  PUBLISHED = "published",
  UNPUBLISHED = "unpublished"
}

registerEnumType(PropertyStatus, {
  name: "PropertyStatus"
});
