import { apiTokenAuthMiddleware } from "./auth";
import { callIdMiddleware } from "./call-id";
import { namekoRpcContextMiddleware } from "./rpc";

const serviceName = process.env.IMAGE_NAME || "platform-gateway";

const middlewares = [
  callIdMiddleware({ serviceName }),
  namekoRpcContextMiddleware,
  apiTokenAuthMiddleware
];

export default middlewares;
