import { get, set, isEmpty, isString, isArray } from "lodash";
import { createMethodDecorator } from "type-graphql";
import { decodeNodeId } from "../utils";

export function simpleDecodeBase64(args, key) {
  /*
  Scenario 2: Obtain the ID or IDS by key name for decryption
     eg:
       input.propertyId
       input.propertyIds
  */
  const value = get(args, key);
  if (isString(value)) {
    set(args, key, decodeNodeId(value)["id"]);
  }
  if (isArray(value) && !isEmpty(value)) {
    set(
      args,
      key,
      value.map(subValue => decodeNodeId(subValue)["id"])
    );
  }
}

export function decodeBase64(keys: string[]) {
  return createMethodDecorator(async ({ args }, next) => {
    for (const key of keys) {
      if (key.includes("[].")) {
        /*
        Scenario 1: [{}], Decrypt a key of an object in the list
          eg: input.commissionTiers[].propertyId

        Note: Currently, only one [] in key is supported

        A better solution:
          add a field-level decorator to the corresponding inputSchema
        */
        const keyArr = key.split("[].");
        const keyArrPrefix = keyArr[0];
        const encodedKey = keyArr[1];
        const objArr = get(args, keyArrPrefix);
        for (const obj of objArr) {
          simpleDecodeBase64(obj, encodedKey);
        }
      } else {
        simpleDecodeBase64(args, key);
      }
    }
    return await next();
  });
}
