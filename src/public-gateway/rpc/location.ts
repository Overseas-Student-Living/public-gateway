import { RpcContext } from "../types/rcp-context";

export const getCity = async (rpc: RpcContext, cityId) => {
  return await rpc.locations.get_city({
    args: [cityId]
  });
};
