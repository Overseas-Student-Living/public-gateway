import { UserInputError } from "apollo-server-express";
import { decodeBase64Id } from "../../utils";
import paymentRpc = require("../../rpc/payment");

import { AuthCallbackFn, checkLandlordCanOperateProperty, checkPropertyIfExist } from "../rules";


async function getProertyTermById(context, args) {
  let termId = args.id;

  if (!termId) {
    throw new UserInputError(
      "permission rule cannot execute invalid args"
    );
  }
  if (isNaN(termId)) {
    termId = decodeBase64Id(termId);
  }
  const term = await paymentRpc.getTermsAndCondition(context.rpc, termId);
  if (!term) {
    throw new UserInputError(
      "permission rule cannot execute with Invalid id"
    );
  }
  return term;
}

export const checkLandlordCanOperatePropertyTerm: AuthCallbackFn = async (
  context,
  roleId,
  args
) => {
  const term = await getProertyTermById(context, args);
  return await checkPropertyIfExist(context, term.propertyId, roleId);
};


export const getPropertyRule = {
  object: {
    landlord: checkLandlordCanOperateProperty,
  },
};

export const updatePropertyRule = {
  object: {
    landlord: checkLandlordCanOperateProperty,
  },
};

export const updatePropertyFacilitiesRule = {
  table: {
    scopes: [
      "c:properties.property_facilities",
      "d:properties.property_facilities",
    ],
  },
  object: {
    landlord: checkLandlordCanOperateProperty,
  },
};

export const createPropertyTermRule = {
  object: {
    landlord: checkLandlordCanOperateProperty,
  },
}

export const deletePropertyTermRule = {
  object: {
    landlord: checkLandlordCanOperatePropertyTerm,
  },
}