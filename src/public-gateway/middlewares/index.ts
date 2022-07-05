import { apiTokenAuthMiddleware } from "./auth";
import { callIdMiddleware } from "./call-id";
import { namekoRpcContextMiddleware } from "./rpc";
import { cacheContextMiddleware } from "./cache";

const serviceName = process.env.IMAGE_NAME || "public-gateway";

const middlewares = [
  callIdMiddleware({ serviceName }),
  namekoRpcContextMiddleware,
  cacheContextMiddleware,
  apiTokenAuthMiddleware
];

export default middlewares;
