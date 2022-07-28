import {
  ID,
  Arg,
  Args,
  Ctx,
  Query,
  Mutation,
  Resolver,
  FieldResolver,
  Root,
  Authorized
} from "type-graphql";

import { Context } from "../../../types/utils";
import { encodeNodeId } from "../../../utils";
import {
  createProperty,
  getProperty,
  getProperties
} from "../../../rpc/property";
import { getCity } from "../../../rpc/location";
import { BookingJourney } from "../../enum";
import {
  CreatePropertyInput,
  CreatePropertyPayload,
  GetPropertiesArgs,
  GetPropertiesPayload,
  GetPropertyPayload,
  Property
} from "../schemas/property";
import { landlordFuncPerm } from "../../perm";
import { decodeBase64 } from "../../../decorators/base64";
import { groupFacilities } from "../utils";

@Resolver(() => Property)
export class PropertyResolver {
  @Query(() => GetPropertyPayload)
  @decodeBase64(["id"])
  async getProperty(@Arg("id", () => ID) id: string, @Ctx() context: Context) {
    const result = await getProperty(context.rpc, id);
    return { property: result };
  }

  @Query(() => GetPropertiesPayload)
  @Authorized(landlordFuncPerm)
  @decodeBase64(["cityId"])
  async getProperties(
    @Args(() => GetPropertiesArgs) args: GetPropertiesArgs,
    @Ctx() context: Context
  ) {
    const res = await getProperties(
      context.rpc,
      args.name,
      context.req.user.roleId,
      args.cityId,
      args.country,
      args.apartmentType,
      args.bookingType,
      args.status,
      args.pageNumber,
      args.pageSize
    );

    return {
      properties: res.results,
      pageInfo: {
        total: res.numResults,
        totalPages: res.numPages,
        currentPage: args.pageNumber,
        pageSize: args.pageSize
      }
    };
  }

  @Mutation(() => CreatePropertyPayload)
  @Authorized(landlordFuncPerm)
  async createProperty(
    @Arg("input", () => CreatePropertyInput, { nullable: false })
    input: CreatePropertyInput,
    @Ctx() context: Context
  ) {
    input["postalCode"] = input.zipCode;
    input["propertyType"] = input.apartmentType;
    input["landlordId"] = context.req.user.roleId;
    input["accountManager"] = context.req.user.email;
    input["bookingJourney"] = BookingJourney.MANUAL;

    const city = await getCity(context.rpc, input.cityId);
    input["country"] = city.country.countryCode;
    input["currency"] = city.country.countryCode;
    input["billingCycle"] = city.country.billingCycle;

    const property = await createProperty(context.rpc, input);

    return { property };
  }

  @FieldResolver()
  id(@Root() root: Property) {
    if (root.id) {
      return encodeNodeId("Property", root.id);
    }
  }

  @FieldResolver()
  cityId(@Root() root: Property) {
    if (root.id) {
      return encodeNodeId("City", root.cityId);
    }
  }

  @FieldResolver()
  async landlordId(@Root() root: Property) {
    return encodeNodeId("Landlord", root.landlordId);
  }

  @FieldResolver()
  zipCode(@Root() root: Property) {
    // @ts-ignore
    return root.postalCode;
  }

  @FieldResolver()
  apartmentType(@Root() root: Property) {
    // @ts-ignore
    return root.propertyType;
  }

  @FieldResolver()
  rentCycle(@Root() root: Property) {
    // @ts-ignore
    return root.billingCycle;
  }

  @FieldResolver()
  bookingType(@Root() root: Property) {
    // @ts-ignore
    return root.bookingJourney;
  }

  @FieldResolver()
  async facilities(@Root() root: Property, @Ctx() context: Context) {
    const facilities = await context.rpc.properties.list_property_facilities({
      args: [root.id]
    });
    return groupFacilities(facilities);
  }
}
