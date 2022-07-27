import {
  FacilityResolver,
  PropertyFacilityResolver
} from "./resolvers/facilities";
import { PropertyResolver } from "./resolvers/property";

export const PropertyResolvers = [
  PropertyResolver,
  FacilityResolver,
  PropertyFacilityResolver
];
