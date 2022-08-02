import * as assert from "assert";
import { ceil } from "lodash";

export const asyncMiddleware = middleware => (req, res, next) => {
  Promise.resolve(middleware(req, res, next)).catch(next);
};

export function transFrontendScopesToBackend(frontendScopes: any) {
  // backendScope: {'c:bookings.students': {}, 'r:bookings.students': {} }
  const backendScope = {};
  frontendScopes.map(frontendScope => {
    const obj = frontendScope.object;
    const perms = frontendScope.permission;
    perms.map(perm => {
      const name = `${perm.toLowerCase()}:${obj}`;
      backendScope[name] = {};
    });
  });
  return backendScope;
}

export function encodeNodeId(type, id) {
  const jsonVal = JSON.stringify({ type, id });
  return Buffer.from(jsonVal).toString("base64");
}

export function decodeNodeId(nodeId) {
  let result;

  try {
    const jsonVal = Buffer.from(nodeId, "base64").toString();
    result = JSON.parse(jsonVal);
  } catch (e) {
    if (e instanceof SyntaxError) {
      throw new Error("invalid node id.");
    } else {
      throw e;
    }
  }

  assert(result.id, "invalid node id");
  assert(result.type, "invalid node id");
  return result;
}

export function decodeBase64Id(nodeId) {
  return decodeNodeId(nodeId).id;
}

export function decodeNodeIdForType(nodeId, expectedType) {
  if (nodeId === undefined || nodeId === null) {
    return nodeId;
  }
  const { id, type } = decodeNodeId(nodeId);
  assert.strictEqual(type, expectedType, `invalid ${expectedType} id`);
  return id;
}

export function formatPageInfo(list, total, pageNumber, pageSize) {
  return {
    pageNumber,
    pageSize,
    results: list,
    numResults: total,
    numPages: ceil(total / pageSize),
  };
}
