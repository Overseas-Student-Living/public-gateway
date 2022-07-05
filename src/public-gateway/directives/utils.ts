import { AuthenticationError } from "apollo-server-express";
import { intersection } from "lodash";
import { decamelizeKeys } from "humps";

import { getLogger } from "../logger";

const log = getLogger("accesscontrol");

export function isAuth(context) {
  const user = context.req.user;
  if (!user) {
    throw new AuthenticationError("unauthorised");
  }
  return true;
}

export function anyRoles(context, requireAnyRoles) {
  const user = context.req.user;
  const currentRole = user.currentRole;
  log.info("anyRoles user: %s, requireAnyRoles: %s", user, requireAnyRoles);

  if (requireAnyRoles.indexOf(currentRole) === -1) {
    throw new AuthenticationError("insufficient current role");
  }
  return true;
}

export function allScopes(context, requireScopes) {
  // scopes: {'c:bookings.students': {}, 'r:bookings.students': {} }
  // requireScopes: ['c:landlord.landlords']
  const user = context.req.user;
  if (!user.scopes) {
    throw new AuthenticationError("scopes is empty");
  }
  const commonScopes = intersection(
    requireScopes,
    Object.keys(decamelizeKeys(user.scopes))
  );
  if (
    intersection(commonScopes, requireScopes).length !== requireScopes.length
  ) {
    throw new AuthenticationError("insufficient scopes");
  }
  return true;
}

export async function accessControl(input, param, context) {
  /*
    @param: input: User input
    @param: param: Permission parameters
    @param: context: Request context
  */
  log.info("input: %o, param: %o", input, param);
  isAuth(context);
  if (param.func) {
    //  Use roles to control function-level permissions
    const requireAnyRoles = param.func.roles;
    anyRoles(context, requireAnyRoles);
  }

  if (param.table) {
    //  Use scopes to control table-level permissions
    const requireAllScopes = param.table.scopes;
    allScopes(context, requireAllScopes);
  }

  return true;
}
