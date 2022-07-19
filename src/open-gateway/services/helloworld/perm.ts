export const studentFuncPerm = {
  func: {
    roles: ["student"]
  }
};

export const landlordFuncPerm = {
  func: {
    roles: ["landlord"]
  },
  table: {
    scopes: ["c:landlord.landlords"]
  }
};
