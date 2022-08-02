import { Context } from "../../../types/utils";
import { HelloworldArgs, HelloworldPayload } from "../schemas/helloworld";
import {
  Arg,
  Ctx,
  Query,
  Resolver,
  UseMiddleware,
  Authorized,
} from "type-graphql";
import { isAuth } from "../../../decorators/authentication";
import { getLogger } from "../../../logger";
import { landlordFuncPerm, studentFuncPerm } from "../perm";

const log = getLogger("user");

@Resolver()
export class HelloworldResolver {
  @Query(() => HelloworldPayload)
  async helloworld(
    @Arg("input", () => HelloworldArgs)
    args: HelloworldArgs,
    @Ctx() context: Context
  ) {
    log.info("context: %o", context.req.user);
    return { content: "hello world: " + args.name };
  }

  @Query(() => HelloworldPayload)
  @UseMiddleware(isAuth)
  async helloworld2(
    @Arg("input", () => HelloworldArgs)
    args: HelloworldArgs,
    @Ctx() context: Context
  ) {
    log.info("context: %o", context.req.user);
    return { content: "hello world: " + args.name };
  }

  @Query(() => HelloworldPayload)
  @Authorized(studentFuncPerm)
  async helloworld3(
    @Arg("input", () => HelloworldArgs)
    args: HelloworldArgs,
    @Ctx() context: Context
  ) {
    log.info("context: %o", context.req.user);
    return { content: "hello world: " + args.name };
  }

  @Query(() => HelloworldPayload)
  @Authorized(landlordFuncPerm)
  async helloworld4(
    @Arg("input", () => HelloworldArgs)
    args: HelloworldArgs,
    @Ctx() context: Context
  ) {
    log.info("context: %o", context.req.user);
    return { content: "hello world: " + args.name };
  }
}
