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
import { decodeNodeIdForType, encodeNodeId } from '../../../utils';
import { City, GetCitiesArgs, GetCitiesPayload } from '../schemas/city';
import { isEmpty } from 'lodash';
import { decodeBase64 } from '../../../decorators/base64';

@Resolver(City)
export class CityResolver {
  @Query(() => City)
  @decodeBase64(['id'])
  @Authorized()
  async getCity(
    @Arg('id', () => ID, { nullable: false }) id: string,
    @Ctx() context: Context
  ) {
    const filters = [
      {
        field: 'id',
        value: id,
      },
    ];
    const res = await context.rpc.locations.list_simple_cities({
      kwargs: {
        filters,
      },
    });
    if (!isEmpty(res)) {
      return res[0];
    }
  }

  @Query(() => GetCitiesPayload)
  @Authorized()
  async getCities(
    @Args(() => GetCitiesArgs) args: GetCitiesArgs,
    @Ctx() context: Context
  ) {
    const filters = [
      {
        field: 'country_id',
        value: decodeNodeIdForType(args.countryId, 'Country'),
      },
      {
        field: 'published',
        value: true,
      },
    ];
    const res = await context.rpc.locations.page_simple_cities({
      kwargs: {
        filters,
        page_num: args.pageNumber,
        page_size: args.pageSize,
      },
    });
    if (!isEmpty(res.results)) {
      return {
        cities: res.results,
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
  id(@Root() root: City) {
    if (root.id) {
      return encodeNodeId('City', root.id);
    }
  }

  @FieldResolver()
  countryId(@Root() root: City) {
    if (root.countryId) {
      return encodeNodeId('Country', root.countryId);
    }
  }
}
