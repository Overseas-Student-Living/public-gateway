import * as moment from "moment";

import {
  Arg,
  Args,
  Authorized,
  Ctx,
  FieldResolver,
  ID,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import listingRpc = require("../../../rpc/listing");
import { decodeBase64 } from "../../../decorators/base64";
import { Context } from "../../../types/utils";
import { encodeNodeId } from "../../../utils";
import { ListingType, TenancyLengthType } from "../enum";
import {
  createListingRule,
  deleteListingRule,
  getListingRule,
  getListingsRule,
  updateListingRule,
} from "../perm";
import {
  CreateRateAvailabilityInput,
  CreateRateAvailabilityPayload,
  DeleteRateAvailabilityInput,
  DeleteRateAvailabilityPayload,
  Discount,
  GetRateAvailabilitiesPayload,
  GetRateAvailabilityArgs,
  GetRateAvailabilityPayload,
  RateAvailability,
  Tenancy,
  UpdateRateAvailabilityInput,
  UpdateRateAvailabilityPayload,
} from "../schemas/listing";

@Resolver(() => RateAvailability)
export class ListingResolver {
  @Query(() => GetRateAvailabilityPayload)
  @decodeBase64(["id"])
  @Authorized(getListingRule)
  async getRateAvailability(
    @Arg("id", () => ID, { nullable: false }) id: string,
    @Ctx() context: Context
  ) {
    const result = await listingRpc.getListing(context.rpc, id);
    return { rateAvailability: result };
  }

  @Query(() => GetRateAvailabilitiesPayload)
  @decodeBase64(["roomId"])
  @Authorized(getListingsRule)
  async getRateAvailabilities(
    @Args(() => GetRateAvailabilityArgs) args: GetRateAvailabilityArgs,
    @Ctx() context: Context
  ) {
    const res = await listingRpc.getListings(
      context.rpc,
      args.roomId,
      args.pageNumber,
      args.pageSize
    );
    return {
      rateAvailabilities: res.results,
      pageInfo: {
        total: res.numResults,
        totalPages: res.numPages,
        currentPage: args.pageNumber,
        pageSize: args.pageSize,
      },
    };
  }

  @Mutation(() => CreateRateAvailabilityPayload)
  @Authorized(createListingRule)
  async createRateAvailability(
    @Arg("input", () => CreateRateAvailabilityInput, { nullable: false })
    input: CreateRateAvailabilityInput,
    @Ctx() context: Context
  ) {
    input["type"] = ListingType.NOT_SPECIFIC;
    input["unitTypeId"] = input.roomId;
    input["availability"] = 999;

    formatInput(input);

    const listing = await listingRpc.createListing(context.rpc, input);
    return { rateAvailability: listing };
  }

  @Mutation(() => UpdateRateAvailabilityPayload)
  @Authorized(updateListingRule)
  async updateRateAvailability(
    @Arg("input", () => UpdateRateAvailabilityInput, { nullable: false })
    input: UpdateRateAvailabilityInput,
    @Ctx() context: Context
  ) {
    formatInput(input);

    // TODO 业务上的校验
    const listing = await listingRpc.updateListing(
      context.rpc,
      input.id,
      input
    );
    return { rateAvailability: listing };
  }

  @Mutation(() => DeleteRateAvailabilityPayload)
  @Authorized(deleteListingRule)
  async deleteRateAvailability(
    @Arg("input", () => DeleteRateAvailabilityInput, { nullable: false })
    input: DeleteRateAvailabilityInput,
    @Ctx() context: Context
  ) {
    await listingRpc.deleteListing(context.rpc, input.id);
    return { result: true };
  }

  @FieldResolver()
  id(@Root() root: RateAvailability): any {
    if (root.id) {
      return encodeNodeId("Listing", root.id);
    }
  }

  @FieldResolver()
  roomId(@Root() root: RateAvailability): any {
    // @ts-ignore
    const unitTypeId = root.unitTypeId;
    if (unitTypeId) {
      return encodeNodeId("UnitType", unitTypeId);
    }
  }

  @FieldResolver()
  bookableFrom(@Root() root: RateAvailability): any {
    // @ts-ignore
    return datetimeStrToDateStr(root.liveOn);
  }

  @FieldResolver()
  bookableTo(@Root() root: RateAvailability): any {
    // @ts-ignore
    return datetimeStrToDateStr(root.liveUntil);
  }

  @FieldResolver()
  tenancy(@Root() root: RateAvailability): any {
    const tenancy = new Tenancy();
    // @ts-ignore
    tenancy.moveIn = root.moveIn;
    // @ts-ignore
    tenancy.moveOut = root.moveOut;
    // @ts-ignore
    tenancy.moveInType = root.moveInType;
    // @ts-ignore
    tenancy.moveOutType = root.moveOutType;
    // @ts-ignore
    tenancy.tenancyLengthType = root.tenancyLengthType;
    // @ts-ignore
    tenancy.tenancyLengthValue = encodeTenancyLengthValue(
      // @ts-ignore
      root.tenancyLengthValue
    );
    return tenancy;
  }

  @FieldResolver()
  discount(@Root() root: RateAvailability): any {
    const discount = new Discount();
    // @ts-ignore
    discount.discountType = root.discountType;
    // @ts-ignore
    discount.discountValue = root.discountValue;
    return discount;
  }
}

function dateStrToDatetimeStr(date) {
  return new Date(date).toISOString();
}

function datetimeStrToDateStr(datetime) {
  return moment(datetime).format("YYYY-MM-DD");
}

function formatInput(input) {
  if (input.bookableFrom) {
    input["liveOn"] = dateStrToDatetimeStr(input.bookableFrom);
  }

  if (input.bookableTo) {
    input["liveUntil"] = dateStrToDatetimeStr(input.bookableTo);
  }

  if (input.tenancy) {
    if (input.tenancy.tenancyLengthValue && input.tenancy.tenancyLengthType) {
      input["tenancyLengthValue"] = decodeTenancyLengthValue(
        input.tenancy.tenancyLengthType,
        input.tenancy.tenancyLengthValue
      );
      input["tenancyLengthType"] = input.tenancy.tenancyLengthType;
    }
    if (input.tenancy.moveInType) {
      input["moveInType"] = input.tenancy.moveInType;
    }
    if (input.tenancy.moveOutType) {
      input["moveOutType"] = input.tenancy.moveOutType;
    }
    if (input.tenancy.moveIn) {
      input["moveIn"] = input.tenancy.moveIn;
    }
    if (input.tenancy.moveOut) {
      input["moveOut"] = input.tenancy.moveOut;
    }
  }

  if (input.discount) {
    if (input.discount.discountType) {
      input["discountType"] = input.discount.discountType;
    }
    if (input.discount.discountValue) {
      input["discountValue"] = input.discount.discountValue;
    }
  }
}

function encodeTenancyLengthValue(tenancyLengthValue: string) {
  if (!tenancyLengthValue) {
    return null;
  }
  if (tenancyLengthValue.indexOf("-") > 0) {
    let [from, to] = tenancyLengthValue.split("-");
    return [parseInt(from), parseInt(to)];
  } else {
    return [parseInt(tenancyLengthValue), parseInt(tenancyLengthValue)];
  }
}

function decodeTenancyLengthValue(
  tenancyLengthType,
  tenancyLengthValue: number[]
) {
  // TODO 校验tenancyLengthType和tenancyLengthValue
  if (tenancyLengthType == TenancyLengthType.BETWEEN) {
    let [from, to] = tenancyLengthValue;
    return `${from}-${to}`;
  } else if (tenancyLengthType == TenancyLengthType.NOT_SPECIFIC) {
    return null;
  } else {
    return tenancyLengthValue[0];
  }
}
