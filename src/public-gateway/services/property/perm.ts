// TODO: Update when authorize at role level
const updatePropertyLayerIsOwnParams = [
  {
    level: "property",
    rpcServer: "properties",
    rpcFunc: "_list_active_properties",
    filters: [
      {
        field: "id",
        op: "==",
        value: "$propertyId"
      },
      {
        field: "id",
        op: "in",
        value: "$roleData.propertyIds"
      }
    ]
  },
  {
    level: "landlord",
    rpcServer: "properties",
    rpcFunc: "_list_active_properties",
    filters: [
      {
        field: "id",
        op: "==",
        value: "$propertyId"
      },
      {
        field: "landlord_id",
        op: "in",
        value: "$roleData.landlordIds"
      }
    ]
  }
];

export const updatePropertyFacilitiesPerm = {
  table: {
    scopes: [
      "c:properties.property_facilities",
      "d:properties.property_facilities"
    ]
  },
  own: {
    landlord: updatePropertyLayerIsOwnParams
  }
};
