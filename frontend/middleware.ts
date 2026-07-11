// Middleware is intentionally minimal.
// Admin route protection is handled client-side in app/admin/layout.tsx
// using Supabase Auth session from localStorage.
export function middleware() {}
export const config = { matcher: [] };
