import * as os from "os";
import * as moment from "moment";

import { getLogger } from "../logger";

const log = getLogger("tracer");

const timestampFormat = "YYYY-MM-DD HH:mm:ss.SSSSSS";
const maxResponseLength = process.env.KIBANA_MAX_FIELD_LENGTH || 10000;

export function tracerRequestMiddleware({ serviceName, ignorePaths }) {
  return async function _tracerRequestMiddleware(req, _) {
    if (ignorePaths.includes(req.path)) {
      return;
    }

    const callIdStack = [];
    // All headers are lowercase in express
    if (req.headers["x-call-id"]) {
      callIdStack.push(req.headers["x-call-id"]);
    }
    callIdStack.push(req.callId);
    const operation = getOperation(req.body);

    const logData = {
      service: serviceName,
      call_id: req.callId,
      call_id_stack: callIdStack,
      context_data: {},
      timestamp: moment().format(timestampFormat),
      entrypoint_type: "HttpEntrypoint",
      hostname: os.hostname(),
      entrypoint_name: req.path,
      operation_type: operation.type,
      operation_name: operation.name,
      call_args_redacted: false,
      call_args: {
        request: {
          path: req.path,
          body: req.body,
          method: req.method,
          protocol: req.protocol,
          headers: getHeaderForTracer(req.headers),
          xhr: req.xhr
        }
      },
      stage: "request",
      client_ip: req.headers["x-real-ip"],
      user_agent: req.headers["user-agent"]
    };

    log.info("entrypoint request trace:\n%j", logData);
  };
}

/**
 * @param requestBody
 * extract the operation type and name from the body of request
 */
const getOperation = requestBody => {
  const operation = {
    name: "",
    type: ""
  };
  if (requestBody) {
    const reg = /(query|mutation)/i;
    const type = requestBody?.query?.match(reg);
    if (type) {
      operation.type = type[1];
      operation.name = requestBody.operationName;
      requestBody.type = operation.type;
    }
  }

  return operation;
};

/**
 * @param responseBody
 * @param responseLength
 * @param responseStatus
 * If response is large, only log errors or 'too long'
 */
const getResponseLog = (responseBody, responseLength, responseStatus) => {
  if (responseLength > maxResponseLength) {
    if (responseStatus === "error") {
      return { errors: responseBody.errors };
    }
    return {
      data: `Hide response which is over ${maxResponseLength} character.`
    };
  }
  return responseBody;
};

const getHeaderForTracer = headers => {
  const redactedHeaders = Object.assign({}, headers);
  // delete sensitive data in cookie, like authorization token
  delete redactedHeaders.cookie;
  delete redactedHeaders.cache_stack;

  // remove the signature from jwt
  if (redactedHeaders.authorization) {
    redactedHeaders.authorization = redactedHeaders.authorization.substring(
      0,
      redactedHeaders.authorization.lastIndexOf(".")
    );
  }
  return redactedHeaders;
};

export function tracerResponseMiddleware({ serviceName, ignorePaths }) {
  return async function _tracerResponseMiddleware(
    req,
    res,
    next,
    { responseStatus = "success", responseBody = {} } = {}
  ) {
    if (ignorePaths.includes(req.path)) {
      next && next();
      return;
    }

    res.header("X-Call-Id", req.callId);

    const responseLength = JSON.stringify(responseBody).length;
    const operation = getOperation(req.body);
    const logData = {
      service: serviceName,
      call_id: req.callId,
      call_id_stack: [req.callId],
      cache_stack: req.headers.cache_stack || [],
      complexity: req.complexity || "0",
      response_truncated: false,
      hostname: os.hostname(),
      call_args: {
        request: {
          path: req.path,
          body: req.body,
          method: req.method,
          protocol: req.protocol,
          headers: getHeaderForTracer(req.headers),
          xhr: req.xhr
        }
      },
      operation_type: operation.type,
      operation_name: operation.name,
      client_ip: req.headers["x-real-ip"],
      user_agent: req.headers["user-agent"],
      domain: req.headers.host,
      response_status: responseStatus,
      stage: "response",
      entrypoint_type: "HttpEntrypoint",
      response_length: responseLength,
      context_data: {},
      timestamp: moment().format(timestampFormat),
      call_args_redacted: false,
      response_time: (Date.now() - req.startTime) / 1000, // in seconds
      entrypoint_name: next ? req.path : req.baseUrl,
      response: {
        body: getResponseLog(responseBody, responseLength, responseStatus)
      }
    };

    log.info("entrypoint result trace:\n%j", logData);

    next && next();
  };
}
