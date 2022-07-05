import { AuthChecker } from "type-graphql";
import { accessControl } from "../directives/utils";

export const requirePermChecker: AuthChecker = async (resolverData, perms) => {
  /*Tips:
    Borrowing from the roles parameter supported by default,
    we only need a permission control parameter (PERM) 
    where the permission information is configured
  */
  const perm = perms[0];
  return await accessControl(resolverData.args, perm, resolverData.context);
};
