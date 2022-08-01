import { isEmpty } from "lodash";
import { decamelizeKeys } from "humps";
import { RpcContext } from "../types/rcp-context";

export const createProperty = async (rpc: RpcContext, input) => {
  return await rpc.properties.create_property({
    args: [decamelizeKeys(input)]
  });
};

export const getProperty = async (rpc: RpcContext, id) => {
  // translation？
  const result = await rpc.properties.list_active_properties({
    kwargs: {
      filters: [{ field: "id", op: "in", value: [id] }]
    }
  });
  if (!isEmpty(result)) {
    return result[0];
  }
  return null;
};

async function resolveListPropertiesFilters({
  name,
  landlordId,
  cityId,
  country,
  apartmentType,
  bookingType,
  status
}) {
  const filters = [];
  if (name) {
    filters.push({ field: "name", op: "like", value: `%${name}%` });
  }
  if (landlordId) {
    filters.push({ field: "landlord_id", op: "==", value: landlordId });
  }
  if (cityId) {
    filters.push({ field: "city_id", op: "==", value: cityId });
  }
  if (country) {
    filters.push({ field: "country", op: "==", value: country });
  }
  if (apartmentType) {
    filters.push({ field: "property_type", op: "==", value: apartmentType });
  }
  if (bookingType) {
    filters.push({ field: "booking_journey", op: "==", value: bookingType });
  }
  if (status) {
    filters.push({ field: "status", op: "==", value: status });
  }
  return filters;
}

export const getProperties = async (
  rpc: RpcContext,
  name,
  landlordId,
  cityId,
  country,
  apartmentType,
  bookingType,
  status,
  pageNumber = 1,
  pageSize = 10
) => {
  const filters = await resolveListPropertiesFilters({
    name,
    landlordId,
    cityId,
    country,
    apartmentType,
    bookingType,
    status
  });
  const results = await rpc.properties.page_active_properties({
    kwargs: {
      filters,
      page_num: pageNumber,
      page_size: pageSize
    }
  });
  console.log("results", results);
  return results;
};

export const updatePropertyDetail = async (rpc: RpcContext, input) => {
  return await rpc.properties.update_property_details({
    kwargs: {
      id_: input.propertyId,
      data: decamelizeKeys(input),
      draft_check: false
    }
  });
};
