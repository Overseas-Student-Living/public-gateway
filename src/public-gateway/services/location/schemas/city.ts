import { ArgsType, Field, ID, Int, ObjectType } from "type-graphql";
import { PageInfo } from "../../common";

@ObjectType()
export class City {
  @Field(() => ID, { nullable: false })
  id: string;
  @Field(() => String, { nullable: false })
  name: string;
  @Field(() => ID, { nullable: false })
  countryId: string;
}

@ArgsType()
export class GetCitiesArgs {
  @Field(() => ID, { nullable: false })
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
