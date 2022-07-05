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
