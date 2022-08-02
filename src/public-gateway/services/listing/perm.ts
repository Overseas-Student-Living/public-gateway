import { UserInputError } from "apollo-server-express";

import listingRpc = require("../../rpc/listing");
import propertyRpc = require("../../rpc/property");
import { decodeBase64Id } from "../../utils";
import { AuthCallbackFn, checkPropertyIfExist } from "../rules";

// TODO log word
async function getListingById(context, args) {
  let listingId = args.id ? args.id : args.listingId;

  if (!listingId) {
    throw new UserInputError(
      "room permission rule cannot execute invalid args"
    );
  }
  if (isNaN(listingId)) {
    listingId = decodeBase64Id(listingId);
  }
  const listing = await listingRpc.getListing(context.rpc, listingId);
  if (!listing) {
    throw new UserInputError(
      "listing permission rule cannot execute with Invalid id"
    );
  }
  return listing;
}

async function getRoomById(context, args) {
  let roomId = args.id ? args.id : args.roomId;

  if (!roomId) {
    throw new UserInputError(
      "room permission rule cannot execute invalid args"
    );
  }
  if (isNaN(roomId)) {
    roomId = decodeBase64Id(roomId);
  }
  const room = await propertyRpc.getRoom(context.rpc, roomId);
  if (!room) {
    throw new UserInputError(
      "room permission rule cannot execute with Invalid id"
    );
  }
  return room;
}

export const checkLandlordCanOperateListing: AuthCallbackFn = async (
  context,
  roleId,
  args
) => {
  const listing = await getListingById(context, args);
  return await checkPropertyIfExist(context, listing.propertyId, roleId);
};

export const checkLandlordCanOperateRoom: AuthCallbackFn = async (
  context,
  roleId,
  args
) => {
  const room = await getRoomById(context, args);
  return await checkPropertyIfExist(context, room.propertyId, roleId);
};

export const getListingRule = {
  object: {
    landlord: checkLandlordCanOperateListing,
  },
};

export const getListingsRule = {
  object: {
    landlord: checkLandlordCanOperateRoom,
  },
};

export const createListingRule = {
  object: {
    landlord: checkLandlordCanOperateRoom,
  },
};

export const updateListingRule = {
  object: {
    landlord: checkLandlordCanOperateListing,
  },
};

export const deleteListingRule = {
  object: {
    landlord: checkLandlordCanOperateListing,
  },
};
