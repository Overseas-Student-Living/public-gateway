import { HelloworldResolvers } from "./helloworld";
import { LocationResolvers } from "./location";
import { PropertyResolvers } from "./property";
import { RoomResolvers } from "./room";

export const typeResolvers = [
  ...HelloworldResolvers,
  ...LocationResolvers,
  ...PropertyResolvers,
  ...RoomResolvers
];
