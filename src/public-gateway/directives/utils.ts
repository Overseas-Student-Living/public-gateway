import { AuthenticationError } from "apollo-server-express";
import { intersection } from "lodash";
import { decamelizeKeys } from "humps";

import { getLogger } from "../logger";
import { AuthCallbackFn } from "../services/rules";

const log = getLogger("accessControl");

export function isAuth(context) {
  const user = context.req.user;
  if (!user) {
    throw new AuthenticationError("Unauthorized");
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

export async function checkObjectLevel(context, rule, args) {
  const user = context.req.user;
  const currentRole = user.currentRole;
  const callbackFn: AuthCallbackFn = rule[currentRole];
  if (!callbackFn) {
    throw new AuthenticationError(
      "No valid object access permission rule found"
    );
  }
  const res = await callbackFn(
    context,
    user.roleId,
    args.input ? args.input : args
  );
  if (!res) {
    throw new AuthenticationError("Object access permission deny");
  }
  return true;
}

export async function accessControl(context, args, rules) {
  /*
    @param: input: User input
    @param: param: Permission parameters
    @param: context: Request context
  */
  log.info("args: %o, rules: %o", args, rules);

  // rules is a list may contain multiple customized rules,
  // for now we only use the first rule define by ourselves.
  const rule = rules[0];

  isAuth(context);

  if (rule && rule.func) {
    //  Use roles to control function-level permissions
    const requireAnyRoles = rule.func.roles;
    anyRoles(context, requireAnyRoles);
  }

  if (rule && rule.table) {
    //  Use scopes to control table-level permissions
    const requireAllScopes = rule.table.scopes;
    allScopes(context, requireAllScopes);
  }

  if (rule && rule.object) {
    // Use callback function to control object-level permissions
    await checkObjectLevel(context, rule.object, args);
  }

  return true;
}
