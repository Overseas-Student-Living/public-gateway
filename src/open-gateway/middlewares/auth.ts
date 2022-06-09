import { isString } from "lodash";

import { asyncMiddleware } from "../utils";

import { getLogger } from "../logger";
import { getUserFromApiToken } from "../rpc/user";

const log = getLogger("auth");

export interface User {
  email: string;
  uuid: string;
  // roles: string[];
  // roleData: any;
  roleId: number;
  scopes: any;
  currentRole: string;
}

async function jwtAuthMiddleware_(req, res, next) {
  const apitoken = req.get("apitoken");
  if (isString(apitoken)) {
    const result = await getUserFromApiToken(req.rpc, apitoken);
    if (result) {
      req.user = {
        roleId: result.roleId,
        uuid: result.uuid,
        currentRole: result.role
      };
    } else {
      return res.status(401).json({
        data: null,
        errors: [{ code: "UNAUTHORISED", message: "invalid apitoken" }]
      });
    }
  }
  log.info("apitoken:%s, user: %s", apitoken, req.user);
  next();
}

export const jwtAuthMiddleware = asyncMiddleware(jwtAuthMiddleware_);
