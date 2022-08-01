/*
Rules for object-level access control
*/

import { UserInputError } from "apollo-server-express";
import { Context } from "../types/utils";

export type AuthCallbackFn = (
  context: Context,
  roleId: number,
  args: any
) => Promise<boolean>;

export const checkPropertyBelongToLandlord: AuthCallbackFn = async (
  context,
  roleId,
  args
) => {
  if (!args.propertyId) {
    throw new UserInputError(
      "property permission rule cannot execute without propertyId"
    );
  }
  const filters = [
    { field: "id", op: "==", value: args.propertyId },
    { field: "landlord_id", op: "in", value: [roleId] },
  ];
  const countNum = await context.rpc.properties.count_active_properties({
    kwargs: {
      filters,
    },
  });
  return countNum > 0;
};
