import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
export class PageInfo {
  @Field(() => Int)
  total: number;
  @Field(() => Int)
  totalPages: number;
  @Field(() => Int)
  currentPage: number;
  @Field(() => Int)
  pageSize: number;
}
