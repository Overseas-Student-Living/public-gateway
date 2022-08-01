import {
  Arg,
  Args,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root
} from "type-graphql";
import { decodeBase64 } from "../../../decorators/base64";
import {
  createRoom,
  deleteRoom,
  getRoomfacilities,
  getRooms,
  updateRoom
} from "../../../rpc/property";
import { Context } from "../../../types/utils";
import { encodeNodeId } from "../../../utils";
import { RoomSizeType } from "../enum";
import {
  CreateRoomInput,
  CreateRoomPayload,
  DeleteRoomInput,
  DeleteRoomPayload,
  GetRoomArgs,
  GetRoomsPayload,
  Room,
  RoomSize,
  UpdateRoomInput,
  UpdateRoomPayload
} from "../schemas/room";

@Resolver(() => Room)
export class RoomResolver {
  @Query(() => GetRoomsPayload)
  @decodeBase64(["propertyId"])
  async getRooms(
    @Args(() => GetRoomArgs) args: GetRoomArgs,
    @Ctx() context: Context
  ) {
    const res = await getRooms(
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
        pageSize: args.pageSize
      }
    };
  }
  // TODO landlord和property校验
  @Mutation(() => CreateRoomPayload)
  async createRoom(
    @Arg("input", () => CreateRoomInput) input: CreateRoomInput,
    @Ctx() context: Context
  ) {
    formatInput(input);
    const room = await createRoom(context.rpc, input);
    return { room };
  }

  @Mutation(() => UpdateRoomPayload)
  async updateRoom(
    @Arg("input", () => UpdateRoomInput) input: UpdateRoomInput,
    @Ctx() context: Context
  ) {
    formatInput(input);
    const room = await updateRoom(context.rpc, input.id, input);
    return { room };
  }

  // TODO 删除应该返回什么
  @Mutation(() => DeleteRoomPayload)
  async deleteRoom(
    @Arg("input", () => DeleteRoomInput) input: DeleteRoomInput,
    @Ctx() context: Context
  ) {
    await deleteRoom(context.rpc, input.id);
    return { result: true };
  }

  @FieldResolver()
  id(@Root() root: Room): any {
    if (root.id) {
      return encodeNodeId("UnitType", root.id);
    }
  }

  @FieldResolver()
  category(@Root() root: Room) {
    // @ts-ignore
    return root.categorySlug;
  }

  @FieldResolver()
  propertyId(@Root() root: Room) {
    if (root.id) {
      return encodeNodeId("Property", root.propertyId);
    }
  }

  @FieldResolver()
  roomSize(@Root() root: Room) {
    // @ts-ignore
    return encodeRoomSize(root.roomSize, root.roomType);
  }

  @FieldResolver()
  async facilities(@Root() root: Room, @Ctx() context: Context) {
    return await getRoomfacilities(context.rpc, root.id);
  }
}

function formatInput(input) {
  if (input.category) {
    input["categorySlug"] = input.category;
  }
  if (input.facilities) {
    input["unitTypeFacilitySlugs"] = input.facilities;
  }
  if (input.bedSizes) {
    input["unitTypeBedSizes"] = input.bedSizes;
  }
  if (input.roomSize) {
    let size = decodeRoomSize(input.roomSize);
    input["roomSize"] = size.size;
    input["roomType"] = size.roomType;
  }
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
    type: roomSizeType,
    minimum: min,
    maximum: max,
    unitOfArea: roomType
  };
}

function decodeRoomSize(roomSize: RoomSize) {
  let size, roomType;
  if (roomSize.type == RoomSizeType.EXACT) {
    size = `${roomSize.minimum}`;
  } else if (roomSize.type == RoomSizeType.MORE_THAN) {
    size = `${roomSize.minimum}+`;
  } else {
    size = `${roomSize.minimum}-${roomSize.maximum}`;
  }
  roomType = roomSize.unitOfArea;
  return { size, roomType };
}
