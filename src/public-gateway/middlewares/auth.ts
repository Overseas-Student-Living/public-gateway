import { isString } from "lodash";
import { decamelizeKeys } from "humps";

import { asyncMiddleware, transFrontendScopesToBackend } from "../utils";

import { getLogger } from "../logger";
import userRpc = require("../rpc/user");

const log = getLogger("auth");

export function keyForRoleScope(role: string) {
  return `role::scope::${role}`;
}

export interface User {
  email: string;
  uuid: string;
  // roles: string[];
  // roleData: any;
  roleId: number;
  scopes: any;
  currentRole: string;
}

async function apiTokenAuthMiddleware_(req, res, next) {
  const apiToken = req.headers["x-api-token"];
  // 没有apitoken的处理，或者长度不对的校验
  if (isString(apiToken)) {
    const result = await userRpc.getUserFromApiToken(req.rpc, apiToken);
    if (result) {
      const currentRole = result.role;
      req.user = {
        roleId: result.roleId,
        uuid: result.uuid,
        currentRole: currentRole,
      };

      // get current role scope from cache
      // 是不是可以把scope的逻辑移到到getUserFromApiToken里，这样scope在user里维护就可以了
      let currentScopes = await req.cache.get(keyForRoleScope(currentRole));
      if (!currentScopes) {
        await req.rpc.users.refresh_role_scopes({
          args: [{ role: currentRole }],
        });
        currentScopes = await req.cache.get(keyForRoleScope(currentRole));
      }

      const backendScope = transFrontendScopesToBackend(currentScopes);
      if (req.user && backendScope) {
        req.user.scopes = decamelizeKeys(backendScope);
      }
    } else {
      return res.status(401).json({
        data: null,
        errors: [{ code: "UNAUTHORISED", message: "invalid x-api-token" }],
      });
    }
  }
  log.info("x-api-token:%s, user: %s", apiToken, req.user);
  next();
}

export const apiTokenAuthMiddleware = asyncMiddleware(apiTokenAuthMiddleware_);
