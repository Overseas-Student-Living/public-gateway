import { UserInputError } from "apollo-server-express";

import propertyRpc = require("../../rpc/property");
import { decodeBase64Id } from "../../utils";
import {
  AuthCallbackFn,
  checkLandlordCanOperateProperty,
  checkPropertyIfExist,
} from "../rules";

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

export const checkLandlordCanOperateRoom: AuthCallbackFn = async (
  context,
  roleId,
  args
) => {
  const listing = await getRoomById(context, args);
  return await checkPropertyIfExist(context, listing.propertyId, roleId);
};

export const getRoomRule = {
  object: {
    landlord: checkLandlordCanOperateRoom,
  },
};

export const getRoomsRule = {
  object: {
    landlord: checkLandlordCanOperateProperty,
  },
};

export const createRoomRule = {
  object: {
    landlord: checkLandlordCanOperateProperty,
  },
};

export const updateRoomRule = {
  object: {
    landlord: checkLandlordCanOperateRoom,
  },
};

export const deleteRoomRule = {
  object: {
    landlord: checkLandlordCanOperateRoom,
  },
};
