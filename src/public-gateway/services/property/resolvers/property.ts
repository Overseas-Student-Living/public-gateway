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
  getProperties,
  updatePropertyDetail
} from "../../../rpc/property";
import { getCity } from "../../../rpc/location";
import { BookingJourney } from "../../enum";
import {
  CreatePropertyInput,
  CreatePropertyPayload,
  GetPropertiesArgs,
  GetPropertiesPayload,
  Property,
  UpdatePropertyPolicyInput
} from "../schemas/property";
import { landlordFuncPerm } from "../../perm";
import { decodeBase64 } from "../../../decorators/base64";
import { PropertyTerm } from "../schemas/terms";
import { listTermsAndConditionsForProperty } from "../../../rpc/payment";

@Resolver(() => Property)
export class PropertyResolver {
  @Query(() => Property)
  @decodeBase64(["id"])
  async property(@Arg("id", () => ID) id: string, @Ctx() context: Context) {
    // 是否需要判断该property是否属于该landlord
    return await getProperty(context.rpc, id);
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
      args.status
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

  @Mutation(() => Property)
  async updatePropertyPolicy(
    @Arg("input", () => UpdatePropertyPolicyInput, { nullable: false })
    input: UpdatePropertyPolicyInput,
    @Ctx() context: Context
  ) {
    const result = await updatePropertyDetail(context.rpc, input);
    return { result };
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
  async zipCode(@Root() root: Property) {
    // @ts-ignore
    return root.postalCode;
  }

  @FieldResolver()
  async apartmentType(@Root() root: Property) {
    // @ts-ignore
    return root.propertyType;
  }

  @FieldResolver()
  async rentCycle(@Root() root: Property) {
    // @ts-ignore
    return root.billingCycle;
  }

  @FieldResolver()
  async bookingType(@Root() root: Property) {
    // @ts-ignore
    return root.bookingJourney;
  }

  @FieldResolver(() => [PropertyTerm])
  async propertyTerms(@Root() root: Property, @Ctx() context: Context) {
    return await listTermsAndConditionsForProperty(context.rpc, root.id);
  }
}
