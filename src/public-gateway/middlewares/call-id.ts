import * as uuid from "uuid/v4";

export function callIdMiddleware({ serviceName }) {
  return (req, _, next) => {
    req.callId = `${serviceName}.${req.path}.${uuid()}`;
    next();
  };
}
