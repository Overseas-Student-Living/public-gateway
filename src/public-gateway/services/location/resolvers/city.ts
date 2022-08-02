import {
  Arg,
  Args,
  Authorized,
  Ctx,
  FieldResolver,
  Query,
  Resolver,
  Root,
} from 'type-graphql';
import { Context } from '../../../types/utils';
import { decodeNodeIdForType, encodeNodeId } from '../../../utils';
import { City, GetCitiesArgs, GetCitiesPayload } from '../schemas/city';
import { isEmpty } from 'lodash';

@Resolver(City)
export class CityResolver {
  @Query(() => City)
  @Authorized()
  async getCity(@Arg('id', () => String) id: string, @Ctx() context: Context) {
    const filters = [
      {
        field: 'id',
        value: decodeNodeIdForType(id, 'City'),
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
      }
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
