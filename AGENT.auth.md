# Authentication Agent

Scope
- Owns authentication across frontend and serverless API using Clerk.
- Ensures environment variables, providers, protected routes, and backend verification are configured.

Primary responsibilities
- Frontend: Configure <ClerkProvider>, ensure sign-in/up flows, and protect routes/components.
- Backend/API: Validate requests using Clerk server SDK; enforce auth on protected endpoints.
- Coordinate token flow between frontend and API.

Frontend setup (Brokeranalysisgooglestudio)
- Required env
```powershell path=null start=null
VITE_CLERK_PUBLISHABLE_KEY={{VITE_CLERK_PUBLISHABLE_KEY}}
```
- Provider and components (as documented in Brokeranalysisgooglestudio/CLAUDE.md)
  - Wrap app with <ClerkProvider> in index.tsx.
  - Use components like <SignedIn>, <SignedOut>, <SignInButton>, <SignUpButton>, <UserButton>.
  - Authentication.tsx and ProtectedRoute.tsx provide UIs and route protection patterns.

Backend/API setup (Brokeranalysisgooglestudio/api)
- Required env
```powershell path=null start=null
CLERK_SECRET_KEY={{CLERK_SECRET_KEY}}
```
- Run API locally
```powershell path=null start=null
npm install
npm run dev
```
- Typical protected call (example curl)
```powershell path=null start=null
curl -X GET "http://localhost:3000/api/users" -H "Authorization: Bearer {{USER_JWT}}"
```

Diagnostics
- Frontend
```powershell path=null start=null
npm run dev
# Inspect auth-related runtime errors in the console and verify Clerk widgets render
```
- Backend
```powershell path=null start=null
npm run dev
# Exercise protected endpoints with a valid Bearer token
```

Notes
- Store real keys only in .env files (not committed). Use placeholders in docs.
- For protected routes, ensure unauthenticated users are redirected to sign-in.
- When adding new protected endpoints in the API, validate Clerk tokens server-side before executing business logic.