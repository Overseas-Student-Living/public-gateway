import { ArgsType, Field, ID, Int, ObjectType } from "type-graphql";
import { PageInfo } from "../../common";

@ObjectType()
export class City {
  @Field(() => ID)
  id: string;
  @Field(() => String!)
  name: string;
  @Field(() => ID!)
  countryId: string;
}

@ArgsType()
export class GetCitiesArgs {
  @Field(() => ID)
  countryId: string;
  @Field(() => Int)
  pageNumber: number = 1;
  @Field(() => Int)
  pageSize: number = 10;
}

@ObjectType()
export class GetCitiesPayload {
  @Field(() => PageInfo)
  pageInfo: PageInfo;
  @Field(() => [City])
  cities: City[];
}
