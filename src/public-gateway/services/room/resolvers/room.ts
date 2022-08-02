import {
  Arg,
  Args,
  Authorized,
  Ctx,
  FieldResolver,
  ID,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import propertyRpc = require("../../../rpc/property");
import { Context } from "../../../types/utils";
import { encodeNodeId } from "../../../utils";
import { RoomSizeType } from "../enum";
import { decodeBase64 } from "../../../decorators/base64";
import {
  createRoomRule,
  deleteRoomRule,
  getRoomRule,
  getRoomsRule,
  updateRoomRule,
} from "../perm";
import {
  BedSize,
  CreateRoomInput,
  CreateRoomPayload,
  DeleteRoomInput,
  DeleteRoomPayload,
  GetRoomsArgs,
  GetRoomPayload,
  GetRoomsPayload,
  Room,
  RoomSize,
  UpdateRoomInput,
  UpdateRoomPayload,
} from "../schemas/room";

@Resolver(() => Room)
export class RoomResolver {
  @Query(() => GetRoomPayload)
  @decodeBase64(["id"])
  @Authorized(getRoomRule)
  async getRoom(
    @Arg("id", () => ID, { nullable: false }) id: string,
    @Ctx() context: Context
  ) {
    const result = await propertyRpc.getRoom(context.rpc, id);
    return { room: result };
  }

  @Query(() => GetRoomsPayload)
  @decodeBase64(["propertyId"])
  @Authorized(getRoomsRule)
  async getRooms(
    @Args(() => GetRoomsArgs) args: GetRoomsArgs,
    @Ctx() context: Context
  ) {
    const res = await propertyRpc.getRooms(
      context.rpc,
      args.propertyId,
      args.pageNumber,
      args.pageSize
    );
    return {
      rooms: res.results,
      pageInfo: {
        total: res.numResults,
        totalPages: res.numPages,
        currentPage: args.pageNumber,
        pageSize: args.pageSize,
      },
    };
  }

  @Mutation(() => CreateRoomPayload)
  @Authorized(createRoomRule)
  async createRoom(
    @Arg("input", () => CreateRoomInput) input: CreateRoomInput,
    @Ctx() context: Context
  ) {
    formatInput(input);
    const room = await propertyRpc.createRoom(context.rpc, input);
    return { room };
  }

  @Mutation(() => UpdateRoomPayload)
  @Authorized(updateRoomRule)
  async updateRoom(
    @Arg("input", () => UpdateRoomInput) input: UpdateRoomInput,
    @Ctx() context: Context
  ) {
    formatInput(input);
    const room = await propertyRpc.updateRoom(context.rpc, input.id, input);
    return { room };
  }

  @Mutation(() => DeleteRoomPayload)
  @Authorized(deleteRoomRule)
  async deleteRoom(
    @Arg("input", () => DeleteRoomInput) input: DeleteRoomInput,
    @Ctx() context: Context
  ) {
    await propertyRpc.deleteRoom(context.rpc, input.id);
    return { result: true };
  }

  @FieldResolver()
  async id(@Root() root: Room) {
    if (root.id) {
      return encodeNodeId("UnitType", root.id);
    }
  }

  @FieldResolver()
  async category(@Root() root: Room) {
    // @ts-ignore
    return root.categorySlug;
  }

  @FieldResolver()
  async propertyId(@Root() root: Room) {
    if (root.propertyId) {
      return encodeNodeId("Property", root.propertyId);
    }
  }

  @FieldResolver()
  async roomSize(@Root() root: Room) {
    // @ts-ignore
    return encodeRoomSize(root.roomSize, root.roomType);
  }

  @FieldResolver()
  async facilities(@Root() root: Room, @Ctx() context: Context) {
    return await propertyRpc.getRoomFacilities(context.rpc, root.id);
  }

  @FieldResolver(() => BedSize)
  async bedSizes(@Root() root: Room, @Ctx() context: Context) {
    return encodeBedSize(await propertyRpc.getRoomBeds(context.rpc, root.id));
  }
}

function formatInput(input: CreateRoomInput | UpdateRoomInput) {
  if (input.category) {
    input["categorySlug"] = input.category;
  }
  // 这里有问题，如果传空数组，并不会清掉数据
  if (input.facilities != undefined) {
    input["unitTypeFacilitySlugs"] = input.facilities;
  }
  if (input.bedSizes) {
    input["unitTypeBedSizes"] = decodeBedSize(input.bedSizes);
  }
  if (input.roomSize) {
    let size = decodeRoomSize(input.roomSize);
    input["roomSize"] = size.size;
    input["roomType"] = size.roomType;
  }
}

function encodeBedSize(bedSize) {
  return bedSize.map(bed => {
    return {
      bedType: bed.type,
      bedCount: bed.bedCount,
      lengthInCM: bed.length,
      widthInCM: bed.width,
    };
  });
}

function decodeBedSize(bedSize: BedSize[]) {
  return bedSize.map(bed => {
    return {
      type: bed.bedType,
      bedCount: bed.bedCount,
      length: bed.lengthInCM,
      width: bed.widthInCM,
    };
  });
}

function encodeRoomSize(size: string, roomType: string) {
  if (!size) {
    return null;
  }
  let roomSizeType;
  let min = null;
  let max = null;
  if (size.indexOf("+") >= 0) {
    [min] = size.split("+");
    roomSizeType = RoomSizeType.MORE_THAN;
  } else if (size.indexOf("-") >= 0) {
    [min, max] = size.split("-");
    roomSizeType = RoomSizeType.BETWEEN;
  } else {
    min = max = size;
    roomSizeType = RoomSizeType.EXACT;
  }
  return {
    descriptor: roomSizeType,
    minimum: min,
    maximum: max,
    unitOfArea: roomType,
  };
}

function decodeRoomSize(roomSize: RoomSize) {
  let size, roomType;
  if (roomSize.descriptor == RoomSizeType.EXACT) {
    size = `${roomSize.minimum}`;
  } else if (roomSize.descriptor == RoomSizeType.MORE_THAN) {
    size = `${roomSize.minimum}+`;
  } else {
    size = `${roomSize.minimum}-${roomSize.maximum}`;
  }
  roomType = roomSize.unitOfArea;
  return { size, roomType };
}
