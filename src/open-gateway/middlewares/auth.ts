import { isString } from "lodash";

import { asyncMiddleware } from "../utils";

import { getLogger } from "../logger";

const log = getLogger("auth");

export interface User {
  email: string;
  uuid: string;
  roles: string[];
  roleData: any;
  scopes: any;
  currentRole: string;
}

async function jwtAuthMiddleware_(req, _, next) {
  const apitoken = req.get("apitoken");
  if (isString(apitoken)) {
    // 根据apitoken去user查询是否有效，如果有效则构建数据放到req.user中，如果apitoken无效则报错
    req.user = { uuid: "", currentRole: "", scopes: [] };
  }
  log.info("apitoken:%s, user: %s", apitoken, req.user);
  next();
}

export const jwtAuthMiddleware = asyncMiddleware(jwtAuthMiddleware_);
