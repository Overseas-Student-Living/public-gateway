import { isEmpty } from "lodash";
import { RpcContext } from "../types/rpc-context";

export const createTermsAndConditions = async (
  rpc: RpcContext,
  propertyId,
  title,
  url,
  validFrom,
  validTill
) => {
  return await rpc.payments.create_deposit_terms_and_conditions({
    args: [
      {
        title,
        url,
        property_id: propertyId,
        valid_from: validFrom,
        valid_till: validTill,
      },
    ],
  });
};


export const getTermsAndCondition = async (rpc: RpcContext, id) => {
  const result = await rpc.payments.list_deposit_terms_and_conditions({
    kwargs: {
      filters: [{ field: "id", op: "in", value: [id] }],
    },
  });
  if (!isEmpty(result)) {
    return result[0];
  }
  return null;
}

export const getTermsAndConditions = async (
  rpc: RpcContext,
  propertyId
) => {
  if (!propertyId) {
    return [];
  }
  const filters = [];
  filters.push({ field: "property_id", value: propertyId });
  return await rpc.payments.list_deposit_terms_and_conditions({
    kwargs: {
      filters: filters,
    },
  });
};

export const deleteTermsAndConditions = async (rpc: RpcContext, id) => {
  return rpc.payments.delete_deposit_terms_and_conditions({
    args: [id],
  });
};
