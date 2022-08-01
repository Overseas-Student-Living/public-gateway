import { RpcContext } from "../types/rpc-context";

export const getCity = async (rpc: RpcContext, cityId) => {
  return await rpc.locations.get_city({
    kwargs: {
      id_: cityId,
      include_areas: true
    }
  });
};
