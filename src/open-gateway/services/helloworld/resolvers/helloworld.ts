// import { Context } from '../../../types/utils';
import { HelloworldArgs, HelloworldPayload } from "../schemas/helloworld";
import { Arg, Query, Resolver } from "type-graphql";

@Resolver()
export class HelloworldResolver {
  @Query(() => HelloworldPayload)
  async helloworld(
    @Arg("input", () => HelloworldArgs)
    args: HelloworldArgs
    // @Ctx() context: Context
  ) {
    return { content: "hello world: " + args.name };
  }
}
