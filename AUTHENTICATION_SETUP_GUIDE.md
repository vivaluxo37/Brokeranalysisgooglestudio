# Authentication Setup Guide

This guide provides step-by-step instructions for setting up authentication in the Broker Analysis platform using Clerk and Supabase.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Clerk account (free tier available)
- Supabase project created
- PostgreSQL database access

## 🔑 Step 1: Clerk Setup

### 1.1 Create Clerk Application
1. Go to [clerk.dev](https://clerk.dev) and create an account
2. Create a new application
3. Choose your preferred authentication methods:
   - ✅ Email/Password
   - ✅ Google OAuth
   - ✅ Facebook OAuth  
   - ✅ Apple OAuth (optional)
4. Get your API keys from the dashboard

### 1.2 Configure Clerk Keys
Add these keys to your environment files:

**Frontend (.env):**
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

**API (.env):**
```env
CLERK_SECRET_KEY=sk_test_your_secret_key_here
```

## 🗄️ Step 2: Database Setup

### 2.1 Run Database Schema
Execute the authentication database schema:

```bash
# Connect to your PostgreSQL database and run:
psql -h your-db-host -U your-username -d your-database -f create_users_auth_table.sql
```

### 2.2 Configure Supabase
Update your API environment with Supabase credentials:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## ⚙️ Step 3: Application Configuration

### 3.1 Frontend Setup
The frontend is already configured with:
- ✅ ClerkProvider wrapper in `index.tsx`
- ✅ Authentication components in `components/Authentication.tsx`
- ✅ AuthContext with user synchronization
- ✅ Protected routes with `ProtectedRoute.tsx`
- ✅ Login/Register pages with Clerk components

### 3.2 API Setup
The API is configured with:
- ✅ Authentication middleware in `api/middleware/auth.ts`
- ✅ User management endpoints in `api/users/route.ts`
- ✅ Token validation for protected endpoints
- ✅ CORS and rate limiting

## 🚦 Step 4: Testing Authentication

### 4.1 Start the Development Servers

**Frontend:**
```bash
cd Brokeranalysisgooglestudio
npm install
npm run dev
```

**API:**
```bash
cd Brokeranalysisgooglestudio/api
npm install
npm run dev
```

### 4.2 Test Authentication Flow

1. **Sign Up Flow:**
   - Navigate to `/register`
   - Create a new account
   - Verify user is created in database
   - Check user appears in dashboard

2. **Sign In Flow:**
   - Navigate to `/login`
   - Sign in with existing account
   - Verify redirected to dashboard
   - Check user session is active

3. **Protected Routes:**
   - Try accessing `/dashboard` without authentication
   - Should redirect to `/login`
   - Sign in and verify access granted

4. **API Authentication:**
   - Test protected API endpoints
   - Verify JWT token validation works
   - Check unauthorized requests are rejected

### 4.3 Test API Endpoints

**Get User Profile:**
```bash
curl -X GET "http://localhost:3000/api/users?id=USER_ID" \
  -H "Authorization: Bearer JWT_TOKEN"
```

**Update User Profile:**
```bash
curl -X PUT "http://localhost:3000/api/users" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer JWT_TOKEN" \
  -d '{"name": "Updated Name"}'
```

**Create Review (Protected):**
```bash
curl -X POST "http://localhost:3000/api/reviews" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer JWT_TOKEN" \
  -d '{
    "brokerId": "broker-123",
    "rating": 4,
    "title": "Great broker",
    "content": "Excellent service and spreads",
    "tradingExperience": "intermediate",
    "accountType": "Standard"
  }'
```

## 🔧 Step 5: Production Deployment

### 5.1 Environment Variables
Set these in your production environment:

**Vercel/Production Frontend:**
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_live_your_production_key
```

**Vercel/Production API:**
```env
CLERK_SECRET_KEY=sk_live_your_production_secret
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GOOGLE_AI_API_KEY=your-google-ai-key
ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com
```

### 5.2 Clerk Production Configuration
1. Create production environment in Clerk dashboard
2. Configure production domain whitelist
3. Set up OAuth provider credentials for production
4. Update webhook endpoints if used

## 🛡️ Security Features

### Authentication Features
- ✅ JWT token validation
- ✅ Secure password handling (Clerk managed)
- ✅ OAuth integration (Google, Facebook, Apple)
- ✅ Session management
- ✅ User profile synchronization

### API Security
- ✅ CORS protection
- ✅ Rate limiting (configurable)
- ✅ Input validation with Zod
- ✅ SQL injection protection
- ✅ Authentication middleware

### Database Security
- ✅ Row Level Security (RLS) policies
- ✅ User audit logging
- ✅ Session tracking
- ✅ Encrypted connections

## 🔍 Troubleshooting

### Common Issues

**1. "Missing Clerk Publishable Key" Error**
- Check your `.env` file has `VITE_CLERK_PUBLISHABLE_KEY`
- Restart the development server after adding environment variables

**2. "Unauthorized" API Errors**
- Verify `CLERK_SECRET_KEY` is set in API environment
- Check JWT token is being sent with requests
- Ensure user is signed in on frontend

**3. Database Connection Issues**
- Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
- Check database schema is properly created
- Ensure RLS policies allow service role access

**4. CORS Errors**
- Check `ALLOWED_ORIGINS` includes your frontend URL
- Verify API CORS configuration matches frontend port

### Debug Mode

Enable debug logging by adding to your API environment:
```env
DEBUG=true
LOG_LEVEL=debug
```

## 📊 Monitoring & Analytics

### User Analytics
- Track user registration and login events
- Monitor authentication success/failure rates
- Analyze user engagement metrics

### Security Monitoring
- Monitor failed authentication attempts
- Track suspicious login patterns
- Alert on security policy violations

## 🆘 Support

For issues with:
- **Clerk Authentication:** [Clerk Documentation](https://clerk.dev/docs)
- **Supabase Database:** [Supabase Documentation](https://supabase.com/docs)
- **Application Issues:** Check application logs and error messages

## 📝 Additional Resources

- [Clerk React SDK Documentation](https://clerk.dev/docs/references/react)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [NextJS API Routes](https://nextjs.org/docs/api-routes/introduction)
- [JWT Token Validation](https://clerk.dev/docs/backend-requests/making/jwt-templates)

---

✅ **Authentication system is now configured and ready for use!**

Remember to:
1. Test thoroughly in development
2. Use production keys for deployment
3. Monitor authentication metrics
4. Keep security policies updated