# OAuth Setup Guide for Clerk Integration

This guide will help you set up Google, Facebook, and Apple OAuth authentication for your forex broker comparison app.

## Prerequisites

- Clerk account with publishable key already configured
- Development server running (currently on http://localhost:5186/)
- Access to developer consoles for Google, Facebook, and Apple

## Step 1: Clerk Dashboard Configuration

### 1.1 Navigate to OAuth Applications
1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Navigate to **OAuth Applications** in the sidebar
3. Click "Create OAuth Application"

### 1.2 Configure Each OAuth App

For each provider (Google, Facebook, Apple), create a separate OAuth application with these settings:

**Basic Configuration:**
- **Name**: `{Provider} OAuth` (e.g., "Google OAuth")
- **Type**: Public (since this is a Single Page Application)
- **Allowed callback URLs**:
  - Local: `http://localhost:5186/oauth/{provider}/callback`
  - Production: `https://yourdomain.com/oauth/{provider}/callback`
- **Scopes**: `profile email` (basic user information)
- **Consent Screen**: Enabled (recommended for security)
- **PKCE**: Automatically enabled for public clients

## Step 2: Google OAuth Setup

### 2.1 Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the required APIs:
   - **Google+ API** (or **People API**)
   - **OAuth 2.0 API**

### 2.2 Create OAuth Credentials
1. Navigate to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Application type: **Web application**
4. Name: `Broker Analysis App`
5. Add authorized redirect URIs:
   - Local: `http://localhost:5186/oauth/google/callback`
   - Production: `https://yourdomain.com/oauth/google/callback`
6. Click **Create**

### 2.3 Copy Credentials to Clerk
1. Copy the **Client ID** and **Client Secret** from Google
2. In Clerk Dashboard, paste these into your Google OAuth application
3. Save the configuration

## Step 3: Facebook OAuth Setup

### 3.1 Facebook Developer Console
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or select existing one
3. Add **Facebook Login** product:
   - In the dashboard, click "Add Products" → "Facebook Login"

### 3.2 Configure Facebook Login
1. In Facebook Login settings:
   - **Client OAuth Login**: Enabled
   - **Web OAuth Login**: Enabled
   - **Enforce HTTPS**: Yes (for production)
   - **Use Strict Mode for Redirect URIs**: Yes

### 3.3 Add Redirect URIs
1. Add valid OAuth redirect URIs:
   - Local: `http://localhost:5186/oauth/facebook/callback`
   - Production: `https://yourdomain.com/oauth/facebook/callback`

### 3.4 Copy Credentials to Clerk
1. Copy the **App ID** and **App Secret** from Facebook
2. In Clerk Dashboard, paste these into your Facebook OAuth application
3. Save the configuration

## Step 4: Apple Sign In Setup

### 4.1 Apple Developer Portal
1. Go to [Apple Developer Portal](https://developer.apple.com/)
2. Navigate to **Certificates, Identifiers & Profiles**
3. Create a new **App ID** if you don't have one

### 4.2 Configure Sign In with Apple
1. Enable **Sign In with Apple** for your App ID
2. Configure the service:
   - **Primary App ID**: Your app's bundle ID
   - **Domains**:
     - Local: `localhost:5186`
     - Production: `yourdomain.com`
   - **Return URLs**:
     - Local: `http://localhost:5186/oauth/apple/callback`
     - Production: `https://yourdomain.com/oauth/apple/callback`

### 4.3 Create Service ID
1. Create a new **Services ID** (Identifier)
2. Register your domains and return URLs
3. Note down the **Service ID** and **Team ID**

### 4.4 Generate Private Key
1. Create a private key for Sign In with Apple
2. Download the private key file (`.p8`)
3. Note the **Key ID**

### 4.5 Copy Credentials to Clerk
1. In Clerk Dashboard, for Apple OAuth application:
   - **Service ID**: Your Apple Service ID
   - **Team ID**: Your Apple Developer Team ID
   - **Key ID**: Your private key ID
   - **Private Key**: Upload the `.p8` file or paste the content
2. Save the configuration

## Step 5: Testing the Integration

### 5.1 Test Each Provider
Visit your login page at `http://localhost:5186/login` and test:

1. **Google OAuth**: Click "Continue with Google"
   - Should redirect to Google sign-in page
   - After authentication, should return to your app
   - User profile should be populated

2. **Facebook OAuth**: Click "Continue with Facebook"
   - Should redirect to Facebook login/permission page
   - After authentication, should return to your app
   - User profile should be populated

3. **Apple Sign In**: Click "Continue with Apple"
   - Should show Apple sign-in dialog
   - After authentication, should return to your app
   - User profile should be populated

### 5.2 Test Protected Routes
1. Try accessing protected routes (e.g., `/dashboard`) when not logged in
2. Should redirect to login page
3. After OAuth login, should be redirected to the protected route

### 5.3 Test Session Persistence
1. Log in with any OAuth provider
2. Refresh the page
3. Should remain logged in
4. User profile should still be accessible

## Troubleshooting

### Common Issues

**Redirect URI Mismatch**
- Ensure callback URLs match exactly in both Clerk and provider consoles
- Include trailing slashes if specified

**CORS Errors**
- Make sure all domains are properly whitelisted
- Check that redirect URIs are correctly configured

**Missing Scopes**
- Verify that `profile` and `email` scopes are requested
- Check provider console for any additional required permissions

**Apple Sign In Issues**
- Apple requires HTTPS for production (use Ngrok or similar for testing)
- Ensure all domains are properly registered in Apple Developer Portal
- Private key must be in the correct format

## Production Deployment

### Update Production URLs
1. Replace all `localhost:5186` with your production domain
2. Update callback URLs in all provider consoles
3. Ensure HTTPS is properly configured

### Security Best Practices
1. Keep consent screens enabled
2. Use minimal required scopes
3. Regularly rotate OAuth credentials
4. Monitor for unusual authentication patterns

## Support

If you encounter any issues:
- Check Clerk's [OAuth documentation](https://clerk.com/docs/guides/configure/auth-strategies/oauth)
- Review provider-specific documentation
- Check browser console for error messages
- Verify all configuration values are correct