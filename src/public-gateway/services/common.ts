import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
export class PageInfo {
  @Field(() => String)
  total: number;
  @Field(() => Int)
  totalPages: number;
  @Field(() => Int)
  currentPage: number;
  @Field(() => Int)
  pageSize: number;
}
