import {
  Arg,
  Args,
  Authorized,
  Ctx,
  FieldResolver,
  ID,
  Query,
  Resolver,
  Root,
} from 'type-graphql';
import { Context } from '../../../types/utils';
import { encodeNodeId } from '../../../utils';
import {
  Country,
  GetCountriesArgs,
  GetCountriesPayload,
} from '../schemas/country';
import { isEmpty } from 'lodash';
import { decodeBase64 } from '../../../decorators/base64';

@Resolver(Country)
export class CountryResolver {
  @Query(() => Country)
  @decodeBase64(['id'])
  @Authorized()
  async getCountry(
    @Arg('id', () => ID, { nullable: false }) id: string,
    @Ctx() context: Context
  ) {
    const filters = [
      {
        field: 'id',
        value: id,
      },
    ];
    const res = await context.rpc.locations.list_simple_countries({
      kwargs: {
        filters,
      },
    });
    if (!isEmpty(res)) {
      return res[0];
    }
  }

  @Query(() => GetCountriesPayload)
  @Authorized()
  async getCountries(
    @Args(() => GetCountriesArgs) args: GetCountriesArgs,
    @Ctx() context: Context
  ) {
    const filters = [{ field: 'published', value: true }];
    const res = await context.rpc.locations.page_simple_countries({
      kwargs: {
        filters,
        page_num: args.pageNumber,
        page_size: args.pageSize,
      },
    });
    if (!isEmpty(res.results)) {
      return {
        counties: res.results,
        pageInfo: {
          total: res.numResults,
          totalPages: res.numPages,
          currentPage: args.pageNumber,
          pageSize: args.pageSize,
        },
      };
    }
  }

  @FieldResolver()
  id(@Root() root: Country) {
    if (root.id) {
      return encodeNodeId('Country', root.id);
    }
  }

  @FieldResolver()
  currency(@Root() root: any) {
    return root.currencyCode;
  }

  @FieldResolver()
  rentCycle(@Root() root: any) {
    return root.billingCycle;
  }
}
