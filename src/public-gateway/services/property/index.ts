
import { PropertyResolver } from "./resolvers/property";
import { PropertyTermResolver } from "./resolvers/terms";
import { FacilityResolver, PropertyFacilityResolver } from "./resolvers/facilities";

export const PropertyResolvers = [PropertyResolver, FacilityResolver, PropertyTermResolver, PropertyFacilityResolver];
