import { helloworldResolver } from "./helloworld";
import { LocationResolvers } from "./location";

export const typeResolvers = [...helloworldResolver, ...LocationResolvers];
