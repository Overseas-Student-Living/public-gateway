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
  Authorized,
} from "type-graphql";

import { Context } from "../../../types/utils";
import { encodeNodeId, getStudentUrl } from "../../../utils";

import propertyRpc = require("../../../rpc/property");
import paymentRpc = require("../../../rpc/payment");
import locationRpc = require("../../../rpc/location");

import { BookingJourney } from "../../enum";
import {
  CreatePropertyInput,
  CreatePropertyPayload,
  GetPropertiesArgs,
  GetPropertiesPayload,
  GetPropertyPayload,
  Property,
  UpdatePropertyPayload,
  UpdatePropertyPolicyInput,
} from "../schemas/property";
import { decodeBase64 } from "../../../decorators/base64";
import { PropertyTerm } from "../schemas/terms";
import { groupFacilities } from "../utils";
import { getPropertyRule, updatePropertyRule } from "../perm";

@Resolver(() => Property)
export class PropertyResolver {
  @Query(() => GetPropertyPayload)
  @Authorized(getPropertyRule)
  @decodeBase64(["id"])
  async getProperty(
    @Arg("id", () => ID, { nullable: false }) id: string,
    @Ctx() context: Context
  ) {
    const result = await propertyRpc.getProperty(context.rpc, id);
    return { property: result };
  }

  @Query(() => GetPropertiesPayload)
  @Authorized()
  @decodeBase64(["cityId"])
  async getProperties(
    @Args(() => GetPropertiesArgs) args: GetPropertiesArgs,
    @Ctx() context: Context
  ) {
    const res = await propertyRpc.getProperties(
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
        pageSize: args.pageSize,
      },
    };
  }

  @Mutation(() => CreatePropertyPayload)
  @Authorized()
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

    const city = await locationRpc.getCity(context.rpc, input.cityId);
    if (city) {
      input["country"] = city.country.countryCode;
      input["currency"] = city.country.currencyCode;
      input["billingCycle"] = city.country.billingCycle;
    }
    const property = await propertyRpc.createProperty(context.rpc, input);
    return { property, reviewlink: getPropertyrReviewLink(property, city) };
  }

  @Mutation(() => UpdatePropertyPayload)
  @Authorized(updatePropertyRule)
  async updatePropertyPolicy(
    @Arg("input", () => UpdatePropertyPolicyInput, { nullable: false })
    input: UpdatePropertyPolicyInput,
    @Ctx() context: Context
  ) {
    const property = await propertyRpc.updatePropertyDetail(context.rpc, input);
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
    return await paymentRpc.listTermsAndConditionsForProperty(
      context.rpc,
      root.id
    );
  }

  @FieldResolver()
  async facilities(@Root() root: Property, @Ctx() context: Context) {
    const facilities = await context.rpc.properties.list_property_facilities({
      args: [root.id],
    });
    return groupFacilities(facilities);
  }
}

async function getPropertyrReviewLink(property, city) {
  return `${getStudentUrl()}/${city.country.slug}/${city.slug}/${
    property.slug
  }?preview=yes&update_cache=yes`;
}
