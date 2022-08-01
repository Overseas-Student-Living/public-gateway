import { checkPropertyBelongToLandlord } from "../rules";

export const updatePropertyFacilitiesRule = {
  table: {
    scopes: [
      "c:properties.property_facilities",
      "d:properties.property_facilities",
    ],
  },
  object: {
    landlord: checkPropertyBelongToLandlord,
  },
};
