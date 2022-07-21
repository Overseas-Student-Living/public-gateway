import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Context } from "../../../types/utils";
import {
  Facility,
  GetFacilitiesPayload,
  UpdatePropertyFacilitiesInput,
  UpdatePropertyFacilitiesPayload,
} from "../schemas/facilities";
import { isEmpty } from "lodash";
import { updatePropertyFacilitiesPerm } from "../perm";

@Resolver(Facility)
export class FacilityResolver {
  @Query(() => GetFacilitiesPayload)
  async getFacilities(@Ctx() context: Context) {
    const facilities = await context.rpc.properties.list_facilities();
    const tagToCategory = {
      amenity: "features",
      bills: "bills",
      security: "security_and_safety",
      rule: "property_rules",
    };
    const res = {
      features: [],
      bills: [],
      security_and_safety: [],
      property_rules: [],
    };
    facilities.forEach((item) => {
      if (item.tags && !isEmpty(item.tags)) {
        const category = tagToCategory[item.tags[0]];
        if (category) {
          res[category].push(item);
        }
      }
    });
    return res;
  }

  @Mutation(() => UpdatePropertyFacilitiesPayload)
  @Authorized(updatePropertyFacilitiesPerm)
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
