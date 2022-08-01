import { Field, InputType, ObjectType } from "type-graphql";

@InputType()
export class HelloworldArgs {
  @Field(() => String)
  name: string;
}

@ObjectType()
export class HelloworldPayload {
  @Field(() => String)
  content: string;
}
