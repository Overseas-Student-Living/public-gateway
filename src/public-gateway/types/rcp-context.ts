export interface RpcContext {
  users: UsersService;
  locations: LocationService;
  properties: PropertyService;
  listings: ListingService;
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
  list_facilities: rpcMethod;
  operate_property_facilities: rpcMethod;
  list_property_facilities: rpcMethod;
  list_active_unit_types: rpcMethod;
  page_active_unit_types: rpcMethod;
  create_room: rpcMethod;
  update_room: rpcMethod;
  delete_room: rpcMethod;
  list_unit_type_facilities: rpcMethod;
  list_bed_sizes_for_unit_type: rpcMethod;
  _list_active_properties: rpcMethod;
}

interface PaymentService extends ServiceBase {
  create_deposit_terms_and_conditions: rpcMethod;
  list_deposit_terms_and_conditions: rpcMethod;
  delete_deposit_terms_and_conditions: rpcMethod;
}

interface ListingService extends ServiceBase {
  create_listing: rpcMethod;
  update_listing: rpcMethod;
  delete_listing: rpcMethod;
  list_listings: rpcMethod;
  count_listings: rpcMethod;
}

interface PaymentService extends ServiceBase {
  create_deposit_terms_and_conditions: rpcMethod;
  list_deposit_terms_and_conditions: rpcMethod;
  delete_deposit_terms_and_conditions: rpcMethod;
}
