# Security Guide

This guide outlines the security measures implemented in the Broker Analysis application and best practices for maintaining security.

## Overview

The application implements a multi-layered security architecture focusing on:
- API key protection
- Input validation and sanitization
- Secure communication
- Authentication and authorization
- Data protection

## 🔐 API Security

### Backend Proxy Server

All AI API calls are routed through a secure backend proxy server located in `/api/proxy-server.js`.

**Key Features:**
- API keys are stored server-side only
- Request validation and sanitization
- Rate limiting (100 requests per 15 minutes)
- CORS configuration
- Security headers (HSTS, CSP, X-Frame-Options, etc.)

### Environment Configuration

```bash
# Backend API keys (server-side only)
GEMINI_API_KEY=your_gemini_api_key_here

# Frontend configuration
VITE_API_BASE_URL=http://localhost:3001
VITE_ENABLE_AI_FEATURES=true
```

**Security Rules:**
- Never commit API keys to version control
- Use environment variables for all sensitive data
- Rotate API keys regularly
- Implement least privilege access

## 🛡️ Input Validation

### Validation Layers

1. **Client-side validation** using `utils/validation.ts`
2. **Server-side validation** in the proxy server
3. **TypeScript strict mode** for compile-time checks

### Validation Schemas

```typescript
// Example validation for user messages
const userMessageSchema: ValidationSchema = {
  message: {
    required: true,
    minLength: 1,
    maxLength: 2000,
    pattern: /^[^<>]*$/,
    custom: (value: string) => {
      if (value.includes('javascript:') || value.includes('onload=')) {
        return 'Message contains invalid content';
      }
      return true;
    }
  }
};
```

### Sanitization Functions

- `sanitizeString()`: Removes HTML tags, JavaScript protocols, and event handlers
- `sanitizeEmail()`: Validates and normalizes email addresses
- `sanitizeUrl()`: Validates URLs and blocks dangerous protocols
- `sanitizeHtml()`: Removes script tags and unsafe HTML elements

## 🌐 Network Security

### HTTPS and TLS

- All production communications must use HTTPS
- TLS 1.2+ only
- HSTS headers enabled

### CORS Configuration

```javascript
// Server-side CORS setup
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Security Headers

The proxy server implements comprehensive security headers:

```javascript
// Content Security Policy
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; 
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com'; connect-src 'self' http://localhost:3001;

// Other headers
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

## 🔑 Authentication

### Clerk Authentication

The application uses Clerk for user authentication:

```typescript
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

function App() {
  return (
    <ClerkProvider publishableKey={VITE_CLERK_PUBLISHABLE_KEY}>
      <SignedIn>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <SignInButton />
      </SignedOut>
    </ClerkProvider>
  );
}
```

### Protected Routes

```typescript
import { ProtectedRoute } from './components/Authentication';

function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
```

## 📊 Data Protection

### Data Storage

- User data stored in contexts (client-side only)
- No sensitive data in localStorage
- Cache invalidation and expiration
- Rate limiting for data requests

### Privacy

- No tracking of personal information without consent
- Anonymous analytics only
- GDPR compliance features

## 🔍 Security Monitoring

### Error Handling

Comprehensive error boundaries with security-focused error reporting:

```typescript
<ErrorBoundary
  onError={(error, errorInfo, errorId) => {
    // Log security-relevant errors
    if (error.message.includes('script') || error.message.includes('xss')) {
      securityService.reportSuspiciousActivity(error, errorId);
    }
  }}
>
  <App />
</ErrorBoundary>
```

### Rate Limiting

- Global rate limiter: 100 requests per 15 minutes
- Per-user rate limiting
- API endpoint specific limits
- Automatic IP blocking for abuse

### Security Audits

Regular security audits should include:

1. **Dependency Scanning**
   ```bash
   npm audit
   npm audit fix
   ```

2. **Code Analysis**
   ```bash
   npm run lint
   npm run type-check
   ```

3. **Bundle Analysis**
   ```bash
   npm run analyze:bundle
   ```

## 🚨 Incident Response

### Security Incident Checklist

1. **Identify the breach**
   - Check error logs for suspicious patterns
   - Review access logs
   - Analyze affected data

2. **Contain the breach**
   - Block suspicious IPs
   - Rotate compromised API keys
   - Disable affected features

3. **Notify stakeholders**
   - Internal team notification
   - User communication if needed
   - Regulatory compliance

4. **Remediate**
   - Fix vulnerabilities
   - Update security measures
   - Improve monitoring

### Reporting Security Issues

If you discover a security vulnerability:

1. **Do not** create a public issue
2. **Do** email security@example.com
3. **Include** detailed description and reproduction steps
4. **Allow** reasonable time to address before disclosure

## 📋 Security Checklist

### Development

- [ ] No hardcoded API keys or secrets
- [ ] Input validation on all user inputs
- [ ] HTTPS in production
- [ ] Security headers configured
- [ ] Error boundaries implemented
- [ ] Rate limiting active
- [ ] Authentication working
- [ ] Dependencies up to date

### Production

- [ ] Environment variables configured
- [ ] SSL/TLS certificates valid
- [ ] CORS properly configured
- [ ] Monitoring active
- [ ] Backup procedures in place
- [ ] Incident response plan ready
- [ ] Regular security scans scheduled

## 🔧 Security Tools

### Recommended Tools

1. **OWASP ZAP** - Web application security scanning
2. **Snyk** - Dependency vulnerability scanning
3. **ESLint Security Plugin** - Code security analysis
4. **Prettier** - Code formatting consistency

### Security Scripts

```bash
# Security audit
npm audit

# Type checking
npm run type-check

# Linting
npm run lint

# Bundle analysis
npm run analyze:bundle
```

## 📖 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Clerk Security Documentation](https://clerk.com/docs/reference/security)
- [React Security Best Practices](https://snyk.io/blog/10-react-security-best-practices/)
- [TypeScript Security](https://typescript-eslint.io/rules/)

---

**Last Updated:** January 2025
**Review Frequency:** Quarterly
**Maintainer:** Development Team
