import { MiddlewareFn } from "type-graphql";
import { Context } from "../types/utils";
import { AuthenticationError } from "apollo-server-express";

export const isAuth: MiddlewareFn<Context> = async ({ context }, next) => {
  const user = context.req.user;
  if (!user) {
    throw new AuthenticationError("unauthorised");
  }

  return next();
};
