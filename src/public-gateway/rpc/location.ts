import { RpcContext } from "../types/rpc-context";

export const getCity = async (rpc: RpcContext, cityId) => {
  return await rpc.locations.get_city({
    args: [cityId]
  });
};
