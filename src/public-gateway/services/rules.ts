/*
Rules for object-level access control
*/

import { UserInputError } from "apollo-server-express";
import { Context } from "../types/utils";
import { decodeBase64Id } from "../utils";

export type AuthCallbackFn = (
  context: Context,
  roleId: number,
  args: any
) => Promise<boolean>;

export async function checkPropertyIfExist(context, propertyId, landlordId) {
  const filters = [
    { field: "id", op: "==", value: propertyId },
    { field: "landlord_id", op: "in", value: [landlordId] },
  ];
  const count = await context.rpc.properties.count_active_properties({
    kwargs: {
      filters,
    },
  });
  console.log(
    "checkPropertyIfExist: propertyId: %s, landlord_id: %s, count: %s",
    propertyId,
    landlordId,
    count
  );
  return count > 0;
}

export const checkLandlordCanOperateProperty: AuthCallbackFn = async (
  context,
  roleId,
  args
) => {
  let propertyId = args.id ? args.id : args.propertyId;
  if (!propertyId) {
    throw new UserInputError(
      "property permission rule cannot execute without propertyId"
    );
  }
  if (isNaN(propertyId)) {
    propertyId = decodeBase64Id(propertyId);
  }
  return await checkPropertyIfExist(context, propertyId, roleId);
};
