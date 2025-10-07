# Authentication Testing Checklist

Use this checklist to verify your authentication setup is working correctly.

## 🧪 Manual Testing Steps

### 1. Frontend Authentication
- [ ] Start frontend: `cd Brokeranalysisgooglestudio && npm run dev`
- [ ] Visit `http://localhost:5173/register`
- [ ] Create a new account using email/password
- [ ] Verify redirect to dashboard after registration
- [ ] Sign out using UserButton
- [ ] Visit `http://localhost:5173/login`
- [ ] Sign in with created account
- [ ] Verify successful login and redirect

### 2. Protected Routes
- [ ] Sign out if logged in
- [ ] Try to access `http://localhost:5173/dashboard`
- [ ] Should redirect to `/login`
- [ ] Try to access `http://localhost:5173/trading-journal`
- [ ] Should redirect to `/login`
- [ ] Sign in and verify access to protected routes

### 3. OAuth Testing
- [ ] Click "Continue with Google" on login/register pages
- [ ] Complete Google OAuth flow
- [ ] Verify account creation and login

### 4. API Authentication (if API is running)
- [ ] Start API: `cd Brokeranalysisgooglestudio/api && npm run dev`
- [ ] Open browser developer tools
- [ ] Sign in to get JWT token from network requests
- [ ] Test authenticated endpoint in terminal:

```bash
# Replace JWT_TOKEN with actual token from browser
curl -X GET "http://localhost:3000/api/users?id=YOUR_USER_ID" \
  -H "Authorization: Bearer JWT_TOKEN"
```

### 5. Database Verification
- [ ] Check if user was created in database
- [ ] Verify user data matches Clerk profile
- [ ] Check if user_sessions table has entries

## 🎯 Success Criteria

✅ **All tests pass if:**
- Users can register and login successfully
- Protected routes redirect unauthenticated users
- OAuth providers work correctly
- API endpoints validate JWT tokens
- User data syncs with database
- No authentication errors in console

## 🚨 Common Issues & Solutions

**Frontend won't start:**
- Run `npm install` in Brokeranalysisgooglestudio/
- Check if port 5173 is available

**"Missing Clerk Publishable Key":**
- Check `.env` file exists with `VITE_CLERK_PUBLISHABLE_KEY`
- Restart dev server after adding environment variables

**API authentication fails:**
- Verify `CLERK_SECRET_KEY` in api/.env
- Check API is running on port 3000
- Ensure JWT token is not expired

**Database connection issues:**
- Verify Supabase credentials in api/.env
- Run the SQL schema script
- Check RLS policies are configured

## 📝 Test Results

Record your test results:

| Test | Status | Notes |
|------|---------|-------|
| Frontend Registration | ⭕ | |
| Frontend Login | ⭕ | |
| Protected Routes | ⭕ | |
| OAuth Flow | ⭕ | |
| API Authentication | ⭕ | |
| Database Sync | ⭕ | |

Legend: ✅ Pass | ❌ Fail | ⭕ Pending