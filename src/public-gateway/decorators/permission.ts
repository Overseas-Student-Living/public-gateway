import { AuthChecker } from "type-graphql";
import { accessControl } from "../directives/utils";

export const requirePermChecker: AuthChecker = async (resolver, rules) => {
  /*Tips:
    Borrowing from the roles parameter supported by default,
    we only need a permission control parameter (PERM) 
    where the permission information is configured
  */
  const { args, context } = resolver;
  return await accessControl(context, args, rules);
};
