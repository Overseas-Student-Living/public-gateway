export interface RpcContext {
  users: UsersService;
}

interface RpcPayload {
  args?: any[];
  kwargs?: {
    [key: string]: any;
  };
}

type rpcMethod<T = any> = (payload?: RpcPayload) => Promise<T>;

interface ServiceBase {
  [key: string]: rpcMethod | any;
}

interface UsersService extends ServiceBase {
  health_check: rpcMethod;
}
