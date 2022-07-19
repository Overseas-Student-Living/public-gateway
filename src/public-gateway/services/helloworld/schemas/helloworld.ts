import { Field, InputType, ObjectType } from "type-graphql";

@InputType()
export class HelloworldArgs {
  @Field(() => String)
  name: String;
}

@ObjectType()
export class HelloworldPayload {
  @Field(() => String)
  content: String;
}
