import { HelloworldResolvers } from "./helloworld";
import { ListingResolvers } from "./listing";
import { LocationResolvers } from "./location";
import { PropertyResolvers } from "./property";
import { RoomResolvers } from "./room";

export const typeResolvers = [
  ...HelloworldResolvers,
  ...LocationResolvers,
  ...PropertyResolvers,
  ...RoomResolvers,
  ...ListingResolvers
];
