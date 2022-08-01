import { isEmpty } from "lodash";

import { RpcContext } from "../types/rcp-context";
import { decamelizeKeys } from "humps";
import { formatPageInfo } from "../utils";

export const createListing = async (rpc: RpcContext, data) => {
  return await rpc.listings.create_listing({ args: [decamelizeKeys(data)] });
};

export const updateListing = async (rpc: RpcContext, id, data) => {
  return await rpc.listings.update_listing({
    args: [id, decamelizeKeys(data)]
  });
};

export const deleteListing = async (rpc: RpcContext, id) => {
  return await rpc.listings.delete_listing({ args: [id] });
};

export const getListing = async (rpc: RpcContext, id) => {
  const result = await rpc.listings.list_listings({
    kwargs: {
      filters: [{ field: "id", op: "in", value: [id] }]
    }
  });
  if (!isEmpty(result)) {
    return result[0];
  }
  return null;
};

export const getListings = async (
  rpc: RpcContext,
  roomId,
  pageNumber = 1,
  pageSize = 10
) => {
  const filters = [];
  if (roomId) {
    filters.push({ field: "unit_type_id", op: "==", value: roomId });
  }
  const results = await rpc.listings.list_listings({
    kwargs: {
      filters,
      offset: (pageNumber - 1) * pageSize,
      limit: pageSize
    }
  });
  const total = await rpc.listings.count_listings({
    kwargs: {
      filters
    }
  });
  return formatPageInfo(results, total, pageNumber, pageSize);
};
