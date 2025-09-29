# Promotions API Documentation

This document describes the promotion API endpoints that provide access to broker promotional offers including cashback programs, deposit bonuses, and other trading incentives.

## Endpoints

### GET /api/promotions

Retrieves a list of promotions with filtering, sorting, and pagination support.

#### Query Parameters

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `brokerIds` | string[] | Filter by broker IDs | - |
| `promotionTypes` | string[] | Filter by promotion types | - |
| `activationMethod` | string[] | Filter by activation method | - |
| `accountTypes` | string[] | Filter by account types | - |
| `isActive` | boolean | Filter by active status | - |
| `isFeatured` | boolean | Filter by featured status | - |
| `minRebate` | number | Minimum rebate amount | - |
| `maxRebate` | number | Maximum rebate amount | - |
| `sortBy` | string | Sort field (rating, rebate_amount, popularity, newest) | created_at |
| `sortOrder` | string | Sort order (asc, desc) | desc |
| `page` | number | Page number (1-based) | 1 |
| `limit` | number | Items per page (max 100) | 20 |

#### Valid Promotion Types
- `cashback`
- `deposit_bonus`
- `commission_discount`
- `copy_trading`
- `vip_program`
- `platform_bonus`
- `welcome_bonus`
- `no_deposit_bonus`
- `loyalty_program`
- `trading_competition`

#### Valid Activation Methods
- `automatic`
- `manual`
- `contact_required`

#### Response

```json
{
  "promotions": [
    {
      "id": "uuid",
      "brokerId": "uuid",
      "broker": {
        "name": "Broker Name",
        "logo": "https://example.com/logo.png",
        "rating": 4.5,
        "platforms": ["MT4", "MT5"]
      },
      "title": "Promotion Title",
      "description": "Promotion description",
      "promotionType": "cashback",
      "isActive": true,
      "isFeatured": true,
      "isExclusive": false,
      "isPopular": true,
      "startDate": "2024-01-01T00:00:00Z",
      "endDate": "2024-12-31T23:59:59Z",
      "activationMethod": "automatic",
      "contactInfo": {
        "email": "support@broker.com",
        "telegram": "@brokersupport"
      },
      "requirements": {
        "minDeposit": 100,
        "accountTypes": ["Standard", "ECN"],
        "tradingVolume": 1,
        "newClientsOnly": false,
        "verificationRequired": true
      },
      "rates": [
        {
          "id": "uuid",
          "tierName": "Basic",
          "minVolume": 0,
          "maxVolume": 10,
          "rateType": "fixed_per_lot",
          "rateValue": 5,
          "currency": "USD",
          "frequency": "monthly"
        }
      ],
      "features": [
        {
          "id": "uuid",
          "featureText": "Automated rebates",
          "featureType": "advantage",
          "isHighlighted": true
        }
      ]
    }
  ],
  "totalCount": 1,
  "hasMore": false,
  "filters": {
    "brokers": [],
    "promotionTypes": [],
    "activationMethods": [],
    "rebateRanges": []
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

#### Example Requests

```bash
# Get all active promotions
GET /api/promotions?isActive=true

# Get cashback promotions for specific brokers
GET /api/promotions?promotionTypes=cashback&brokerIds=broker1,broker2

# Get featured promotions with pagination
GET /api/promotions?isFeatured=true&page=2&limit=10

# Get promotions sorted by rebate amount
GET /api/promotions?sortBy=rebate_amount&sortOrder=desc
```

### GET /api/promotions/[id]

Retrieves detailed information for a specific promotion.

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Promotion UUID |

#### Response

Returns a single promotion object (same structure as in the list endpoint).

#### Error Responses

- `404` - Promotion not found
- `410` - Promotion inactive or expired
- `400` - Invalid promotion ID format

#### Example Request

```bash
GET /api/promotions/550e8400-e29b-41d4-a716-446655440000
```

### POST /api/promotions/calculate

Calculates rebate amounts for a specific promotion based on trading volume.

#### Request Body

```json
{
  "promotionId": "550e8400-e29b-41d4-a716-446655440000",
  "monthlyVolume": 10.5,
  "accountType": "Standard"
}
```

#### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `promotionId` | string | Yes | Promotion UUID |
| `monthlyVolume` | number | Yes | Monthly trading volume in lots |
| `accountType` | string | No | Account type for eligibility check |

#### Response

```json
{
  "result": {
    "rebateAmount": 50,
    "rateValue": 5,
    "rateType": "fixed_per_lot",
    "tierName": "Basic",
    "currency": "USD",
    "frequency": "monthly",
    "dailyRebate": 1.67,
    "monthlyRebate": 50,
    "yearlyRebate": 600,
    "effectiveCostReduction": 7.14,
    "nextTierVolume": 10,
    "nextTierRebate": 80
  },
  "recommendations": [
    {
      "id": "uuid",
      "title": "Similar Promotion",
      "promotionType": "cashback"
    }
  ]
}
```

#### Error Responses

- `400` - Invalid request parameters
- `404` - Promotion not found
- `400` - Promotion inactive or expired
- `400` - Account type not eligible
- `400` - Insufficient trading volume
- `400` - No applicable rate tier found

#### Example Request

```bash
POST /api/promotions/calculate
Content-Type: application/json

{
  "promotionId": "550e8400-e29b-41d4-a716-446655440000",
  "monthlyVolume": 25,
  "accountType": "ECN"
}
```

## Rate Limiting

All endpoints are rate-limited to prevent abuse:

- **General endpoints**: 100 requests per minute per IP
- **Calculator endpoint**: 50 requests per minute per IP

Rate limit headers are included in responses:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Remaining requests in current window
- `X-RateLimit-Reset`: Unix timestamp when limit resets
- `Retry-After`: Seconds to wait before retrying (on 429 responses)

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {},
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

### Common Error Codes

- `METHOD_NOT_ALLOWED` - HTTP method not supported
- `VALIDATION_ERROR` - Invalid request parameters
- `PROMOTION_NOT_FOUND` - Promotion does not exist
- `PROMOTION_INACTIVE` - Promotion is not active
- `PROMOTION_EXPIRED` - Promotion has expired
- `INVALID_ACCOUNT_TYPE` - Account type not eligible
- `INSUFFICIENT_VOLUME` - Trading volume below minimum
- `NO_APPLICABLE_RATE` - No rate tier matches volume
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `INTERNAL_SERVER_ERROR` - Unexpected server error

## CORS Support

All endpoints support CORS with the following headers:
- `Access-Control-Allow-Origin`
- `Access-Control-Allow-Methods`
- `Access-Control-Allow-Headers`
- `Access-Control-Allow-Credentials`

## Caching

Responses include appropriate cache headers:
- **Promotion lists**: 5 minutes client, 10 minutes CDN
- **Individual promotions**: 10 minutes client, 20 minutes CDN
- **Calculations**: 1 minute client, 2 minutes CDN

## Analytics Tracking

The API automatically tracks promotion interactions:
- **Views**: When a promotion is retrieved via GET /api/promotions/[id]
- **Clicks**: When calculations are performed
- **Conversions**: When users sign up (tracked separately)

Tracking is fire-and-forget and does not affect API response times.