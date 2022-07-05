import { Kinopio } from "kinopio";
import { camelizeKeys } from "humps";
import { isString, toLower } from "lodash";
import acceptLanguage from "accept-language";

import { getLogger } from "../logger";
import { Response, NextFunction } from "express";
import { LOCALES } from "../constants/translation";

const log = getLogger("rpc-contect");

export const kinopio = new Kinopio("public-gateway", {
  hostname: process.env.RABBIT_SERVER,
  port: process.env.RABBIT_PORT ? parseInt(process.env.RABBIT_PORT, 10) : 5672,
  vhost: process.env.RABBIT_VHOST,
  username: process.env.RABBIT_USER,
  password: process.env.RABBIT_PASS,
  logger:
    process.env.ENV === "DEV"
      ? log.info
      : () => {
          return;
        },
  // onResponse: result => {
  // },
  // onRequest: (svcName, functionName, payload) => {
  // },
  processResponse: response => camelizeKeys(response),
  queuePrefix: "rpc.reply-public-gateway"
});

acceptLanguage.languages(LOCALES);

export function namekoRpcContextMiddleware(
  req: any,
  _: Response,
  next: NextFunction
) {
  const callIdStack = [];
  if (req.headers["x-call-id"]) {
    callIdStack.push(req.headers["x-call-id"]);
  }
  callIdStack.push(req.callId);

  const workerCtx: any = {
    "nameko.call_id_stack": callIdStack
  };

  // 是否需要根据req.user信息，构建一个jwttoken，放到authorization里，因为property会解析该上下文去取对应的property
  if (req.auth) {
    workerCtx["nameko.authorization"] = req.auth;
  }

  const acceptLanguageHeader = req.get("Accept-Language");
  if (isString(acceptLanguageHeader)) {
    const language = toLower(acceptLanguage.get(acceptLanguageHeader));
    workerCtx["nameko.locale"] = language;
    workerCtx["nameko.language"] = language;
    req.locale = language;
  }

  req.rpc = kinopio.buildRpcProxy(workerCtx);
  log.debug("rpc context:\n%j", workerCtx);

  next();
}
