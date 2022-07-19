import { apiTokenAuthMiddleware } from "./auth";
import { callIdMiddleware } from "./call-id";
import { tracerRequestMiddleware, tracerResponseMiddleware } from "./tracer";
import { namekoRpcContextMiddleware} from "./rpc";
import { cacheContextMiddleware } from "./cache";

const serviceName = process.env.IMAGE_NAME || "public-gateway";



const tracerOptions = {
  serviceName,
  ignorePaths: ["/metrics", "/healthcheck"]
};
export const tracerRequestHandler = tracerRequestMiddleware(tracerOptions);
export const tracerResponseHandler = tracerResponseMiddleware(tracerOptions);

const middlewares = [
  callIdMiddleware({ serviceName }),
  namekoRpcContextMiddleware,
  cacheContextMiddleware,
  apiTokenAuthMiddleware
];

export default middlewares;
