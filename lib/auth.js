// Server-only: checks the "x-admin-password" header against ADMIN_PASSWORD.
export function isAuthorized(request) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;

  const provided = request.headers.get("x-admin-password");
  return provided === expected;
}
