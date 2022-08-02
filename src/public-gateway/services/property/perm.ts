import { checkPropertyBelongToLandlord } from "../rules";

export const editPropertyPermission = {
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
