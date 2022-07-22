export interface RpcContext {
  users: UsersService;
  locations: LocationService;
  properties: PropertyService;
  payments: PaymentService;
}

interface RpcPayload {
  args?: any[];
  kwargs?: {
    [key: string]: any;
  };
}

type rpcMethod<T = any> = (payload?: RpcPayload) => Promise<T>;

interface ServiceBase {
  health_check: rpcMethod;
}

interface UsersService extends ServiceBase {
  get_user_from_api_token: rpcMethod;
  refresh_role_scopes: rpcMethod;
}

interface LocationService extends ServiceBase {
  list_simple_cities: rpcMethod;
  list_simple_countries: rpcMethod;
  page_simple_cities: rpcMethod;
  page_simple_countries: rpcMethod;
  get_city: rpcMethod;
}

interface PropertyService extends ServiceBase {
  create_property: rpcMethod;
  list_active_properties: rpcMethod;
  page_active_properties: rpcMethod;
  update_property_details: rpcMethod;
}

interface PaymentService extends ServiceBase {
  create_deposit_terms_and_conditions: rpcMethod;
  list_deposit_terms_and_conditions: rpcMethod;
  delete_deposit_terms_and_conditions: rpcMethod;
}
