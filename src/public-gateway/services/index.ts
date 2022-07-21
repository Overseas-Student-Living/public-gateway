import { HelloworldResolvers } from "./helloworld";
import { LocationResolvers } from "./location";
import { PropertyResolvers } from "./property";

export const typeResolvers = [
  ...HelloworldResolvers,
  ...LocationResolvers,
  ...PropertyResolvers
];
