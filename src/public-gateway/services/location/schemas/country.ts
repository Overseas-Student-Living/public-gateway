import { ArgsType, Field, ID, Int, ObjectType } from "type-graphql";
import { PageInfo } from "../../common";
import { BillingCycle } from "../../enum";

@ObjectType()
export class Country {
  @Field(() => ID!)
  id: string;
  @Field(() => String!)
  name: string;
  @Field(() => String!)
  currency: string;
  @Field(() => BillingCycle!)
  rentCycle: BillingCycle;
}

@ArgsType()
export class GetCountriesArgs {
  @Field(() => Int)
  pageNumber: number = 1;
  @Field(() => Int)
  pageSize: number = 10;
}

@ObjectType()
export class GetCountriesPayload {
  @Field(() => PageInfo)
  pageInfo: PageInfo;
  @Field(() => [Country])
  counties: Country[];
}
