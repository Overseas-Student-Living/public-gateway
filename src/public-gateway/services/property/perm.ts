import { checkLandlordCanOperateProperty } from "../rules";

export const getPropertyRule = {
  object: {
    landlord: checkLandlordCanOperateProperty,
  },
};

export const updatePropertyRule = {
  object: {
    landlord: checkLandlordCanOperateProperty,
  },
};

export const updatePropertyFacilitiesRule = {
  table: {
    scopes: [
      "c:properties.property_facilities",
      "d:properties.property_facilities",
    ],
  },
  object: {
    landlord: checkLandlordCanOperateProperty,
  },
};
