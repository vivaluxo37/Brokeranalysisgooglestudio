# Broker Analysis Platform - Serverless API

This directory contains the serverless backend API for the Broker Analysis Platform, built with Vercel, Node.js, TypeScript, and Supabase.

## Features

- **Authentication**: Clerk integration for secure user authentication
- **Database**: Supabase PostgreSQL with comprehensive schema
- **AI Integration**: Google Gemini AI for chatbot and AI tutor functionality
- **Rate Limiting**: Configurable rate limiting for different endpoint types
- **Security**: CORS, authentication middleware, and input validation
- **API Endpoints**: Complete REST API for brokers, reviews, users, comparisons, and favorites

## API Endpoints

### Brokers
- `GET /api/brokers` - List brokers with filtering, search, and pagination
- `GET /api/brokers/[id]` - Get detailed broker information

### Reviews
- `GET /api/reviews` - List reviews with filtering and pagination
- `POST /api/reviews` - Create a new review (requires authentication)

### Users
- `GET /api/users` - Get user information
- `PUT /api/users` - Update user profile (requires authentication)

### User Favorites
- `GET /api/users/[id]/favorites` - Get user's favorite brokers
- `POST /api/users/[id]/favorites` - Add broker to favorites
- `DELETE /api/users/[id]/favorites` - Remove broker from favorites

### Comparisons
- `GET /api/comparisons` - List broker comparisons
- `POST /api/comparisons` - Create a new comparison
- `GET /api/comparisons/[id]` - Get specific comparison
- `PUT /api/comparisons/[id]` - Update comparison
- `DELETE /api/comparisons/[id]` - Delete comparison

### Chat
- `POST /api/chat` - Streaming chat with AI (supports chatbot and tutor modes)

## Setup Instructions

### 1. Environment Variables

Create a `.env` file based on `env.example`:

```bash
cp env.example .env
```

Configure the following environment variables:

```bash
# Clerk Authentication
CLERK_SECRET_KEY=your_clerk_secret_key

# Google AI API
GOOGLE_AI_API_KEY=your_google_ai_api_key

# Supabase Database
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Rate Limiting (optional)
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS_GENERAL=100
RATE_LIMIT_MAX_REQUESTS_CHAT=20
RATE_LIMIT_MAX_REQUESTS_AUTH=10
```

### 2. Database Setup

1. Create a Supabase project
2. Run the database schema:

```sql
-- Execute the schema.sql file in your Supabase SQL editor
-- or use the Supabase CLI: supabase db push
```

3. Optionally run the seed data for testing:

```sql
-- Execute the seeds.sql file to populate sample data
```

### 3. Dependencies

Install dependencies:

```bash
npm install
```

### 4. Local Development

Run the development server:

```bash
npm run dev
```

The API will be available at `http://localhost:3000/api`

## Database Schema

The platform uses a comprehensive PostgreSQL schema with the following main tables:

- `users` - User profiles and preferences
- `brokers` - Broker information and details
- `broker_regulations` - Regulatory information
- `broker_platforms` - Trading platforms
- `broker_fees` - Fee structure
- `broker_trading_instruments` - Available instruments
- `broker_customer_support` - Support information
- `reviews` - User reviews and ratings
- `user_favorites` - User favorite brokers
- `comparisons` - Broker comparisons
- `broker_comparisons` - Junction table for comparisons
- `trading_journals` - User trading journals
- `education_progress` - Learning progress tracking
- `discussions` - Community discussions
- `discussion_replies` - Discussion replies

## Security Features

- **Authentication**: Clerk integration with JWT tokens
- **Rate Limiting**: Configurable limits for different endpoint types
- **Input Validation**: Zod schema validation for all inputs
- **CORS**: Configurable CORS headers
- **Row Level Security**: Supabase RLS policies for data protection
- **Environment Variables**: Secure configuration management

## Rate Limiting

The API implements rate limiting with different limits:

- **General endpoints**: 100 requests per minute
- **Chat endpoints**: 20 requests per minute
- **Auth endpoints**: 10 requests per minute

## Deployment

### Vercel Deployment

1. Push your code to a Git repository
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically

### Environment Variables on Vercel

Configure these variables in your Vercel project settings:

- `CLERK_SECRET_KEY`
- `GOOGLE_AI_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## API Usage Examples

### Get Brokers

```bash
curl "http://localhost:3000/api/brokers?search=XM&limit=5"
```

### Create Review

```bash
curl -X POST "http://localhost:3000/api/reviews" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_jwt_token" \
  -d '{
    "brokerId": "broker-uuid",
    "rating": 5,
    "title": "Great broker",
    "content": "Excellent service and spreads"
  }'
```

### Chat with AI

```bash
curl -X POST "http://localhost:3000/api/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is scalping?",
    "context": "tutor",
    "history": []
  }'
```

## Error Handling

The API returns standardized error responses:

```json
{
  "error": "Error type",
  "message": "Detailed error message"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

## Development Guidelines

- All endpoints include proper error handling
- Input validation using Zod schemas
- Type safety with TypeScript
- Consistent response formats
- Security middleware for all endpoints
- Comprehensive logging for debugging

## Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## Contributing

1. Follow the existing code style
2. Add proper TypeScript types
3. Include input validation
4. Add error handling
5. Update documentation

## License

This project is licensed under the MIT License.