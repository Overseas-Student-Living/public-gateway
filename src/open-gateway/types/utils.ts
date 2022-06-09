import { Request } from "express";
import { RpcContext } from "./rcp-context";

export interface GatewayRequest extends Request {
  cache: any;
  locale: any;
  user: any;
  auth: any;
}

export interface Context {
  req?: GatewayRequest;
  res?: Express.Response;
  locale?: string;
  rpc?: RpcContext;
}
