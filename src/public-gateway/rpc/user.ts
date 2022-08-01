import { getLogger } from "../logger";
import { RpcContext } from "../types/rpc-context";

const log = getLogger("user_rpc");

export const getUserFromApiToken = async (rpc: RpcContext, apiToken) => {
  // 验证token是否有效，如果有效，则根据token信息获取角色，uuid等信息，并且更新token使用时间
  try {
    return await rpc.users.get_user_from_api_token({
      args: [apiToken]
    });
    // mock
    // return {
    //   roleId: 1,
    //   uuid: "",
    //   email: "",
    //   role: "landlord",
    // };
  } catch (error) {
    log.error("getUserFromApiToken error: %s", error);
    return null;
  }
};
