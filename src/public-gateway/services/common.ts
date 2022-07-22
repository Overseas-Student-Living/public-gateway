import { Field, Int, ObjectType } from "type-graphql";
import * as Stream from "stream";

export interface Upload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => Stream;
}

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

@ObjectType()
export class ResultPayload {
  @Field(() => Boolean)
  result: boolean;
}
