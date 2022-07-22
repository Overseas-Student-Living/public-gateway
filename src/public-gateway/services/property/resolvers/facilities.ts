import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
import { Context } from "../../../types/utils";
import {
  Facility,
  GetFacilitiesPayload,
  PropertyFacility,
  UpdatePropertyFacilitiesInput,
  UpdatePropertyFacilitiesPayload,
} from "../schemas/facilities";
import { groupFacilities } from "../utils";

@Resolver(Facility)
export class FacilityResolver {
  @Query(() => GetFacilitiesPayload)
  async getFacilities(@Ctx() context: Context) {
    const facilities = await context.rpc.properties.list_facilities();
    return groupFacilities(facilities);
  }

  @Mutation(() => UpdatePropertyFacilitiesPayload)
  // TODO: Refactor access control on resource level
  //   @Authorized(updatePropertyFacilitiesPerm)
  async updatePropertyFacilities(
    @Arg("input", () => UpdatePropertyFacilitiesInput)
    input: UpdatePropertyFacilitiesInput,
    @Ctx() context: Context
  ) {
    const success = await context.rpc.properties.operate_property_facilities({
      kwargs: {
        property_id: input.propertyId,
        facility_slugs: input.facilitySlugs,
      },
    });
    return { success };
  }
}

@Resolver(PropertyFacility)
export class PropertyFacilityResolver {
  @FieldResolver()
  checked() {
    return true;
  }
}
