import { FacilityResolver } from "./resolvers/facilities";
import { PropertyResolver } from "./resolvers/property";
import { PropertyTermResolver } from "./resolvers/terms";

export const PropertyResolvers = [PropertyResolver, PropertyTermResolver, FacilityResolver];
