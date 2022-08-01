import { Context } from "../../types/utils";

const updatePropertyLayerIsOwnRule = async (
  context: Context,
  roleId,
  args
) => {
  const filters = [{ field: "landlord_id", op: "in", value: [roleId] }];
  if (args.propertyId) {
    filters.push({ field: "id", op: "==", value: args.propertyId });
  }
  // 感觉count方法就可以了，用不着list？
  return await context.rpc.properties._list_active_properties({
    kwargs: {
      filters,
    },
  });
};

export const updatePropertyFacilitiesRule = {
  table: {
    scopes: [
      "c:properties.property_facilities",
      "d:properties.property_facilities",
    ],
  },
  resource: {
    landlord: updatePropertyLayerIsOwnRule,
  },
};
