# API Documentation

AiFarcaster API documentation for integrating with external services.

## Overview

**NOTE:** The API endpoints described in this document are currently scaffolding/planned features. No API routes are implemented in the current codebase. You will need to implement these endpoints in your application under the `/app/api` directory.

The AiFarcaster API (when implemented) will be built with Next.js API routes and provide endpoints for:
- Frame management
- Template operations
- Payment processing
- Analytics and metrics

## Base URL

```
Production: https://your-domain.com/api
Development: http://localhost:3000/api
```

## Authentication

**NOTE:** Token-based authentication is not currently implemented. The application uses wallet-based authentication via RainbowKit on the frontend. You will need to implement API authentication separately.

When implemented, API requests should include authentication:

```typescript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

## Endpoints

### Frames

#### Create Frame

```http
POST /api/frames
```

**Request Body:**
```json
{
  "title": "My Frame",
  "description": "Frame description",
  "type": "token-launch",
  "config": {
    "tokenName": "MyToken",
    "symbol": "MTK"
  }
}
```

**Response:**
```json
{
  "id": "frame_123",
  "title": "My Frame",
  "status": "draft",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

#### Get Frame

```http
GET /api/frames/:id
```

**Response:**
```json
{
  "id": "frame_123",
  "title": "My Frame",
  "description": "Frame description",
  "status": "active",
  "views": 1234,
  "interactions": 567
}
```

#### Update Frame

```http
PATCH /api/frames/:id
```

**Request Body:**
```json
{
  "title": "Updated Title",
  "status": "active"
}
```

#### Delete Frame

```http
DELETE /api/frames/:id
```

#### List Frames

```http
GET /api/frames?page=1&limit=20&status=active
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `status` - Filter by status (draft, active, archived)

### Templates

#### List Templates

```http
GET /api/templates?category=defi&free=true
```

**Query Parameters:**
- `category` - Filter by category
- `free` - Show only free templates (true/false)
- `featured` - Show only featured templates (true/false)

**Response:**
```json
{
  "templates": [
    {
      "id": "template_123",
      "name": "Token Launch",
      "category": "DeFi",
      "price": 0,
      "isFree": true
    }
  ],
  "total": 100,
  "page": 1
}
```

#### Get Template

```http
GET /api/templates/:id
```

#### Purchase Template

```http
POST /api/templates/:id/purchase
```

**Request Body:**
```json
{
  "paymentMethod": "stripe",
  "paymentId": "pi_123456"
}
```

### Projects

#### Create Project

```http
POST /api/projects
```

**Request Body:**
```json
{
  "name": "My Project",
  "description": "Project description",
  "members": ["0x123...", "0x456..."]
}
```

#### Get Project

```http
GET /api/projects/:id
```

#### Update Project

```http
PATCH /api/projects/:id
```

#### List Projects

```http
GET /api/projects
```

### Payments

#### Create Stripe Checkout

```http
POST /api/stripe/checkout
```

**Request Body:**
```json
{
  "priceId": "price_123",
  "successUrl": "/success",
  "cancelUrl": "/cancel"
}
```

**Response:**
```json
{
  "id": "cs_123456",
  "url": "https://checkout.stripe.com/..."
}
```

#### Stripe Webhook

```http
POST /api/stripe/webhook
```

Handles Stripe webhook events.

#### Verify Crypto Payment

```http
POST /api/payments/verify
```

**Request Body:**
```json
{
  "txHash": "0x123...",
  "network": "base"
}
```

**Response:**
```json
{
  "verified": true,
  "amount": "0.01",
  "token": "ETH",
  "from": "0x123...",
  "to": "0x456..."
}
```

### Analytics

#### Get Frame Analytics

```http
GET /api/analytics/frames/:id
```

**Query Parameters:**
- `startDate` - Start date (ISO 8601)
- `endDate` - End date (ISO 8601)

**Response:**
```json
{
  "views": 1234,
  "interactions": 567,
  "uniqueVisitors": 890,
  "timeline": [
    {
      "date": "2024-01-01",
      "views": 100,
      "interactions": 45
    }
  ]
}
```

#### Get Dashboard Stats

```http
GET /api/analytics/dashboard
```

**Response:**
```json
{
  "totalFrames": 12,
  "activeProjects": 5,
  "totalViews": 12345,
  "totalRevenue": 420.00
}
```

## Error Handling

All errors follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {}
  }
}
```

### Error Codes

- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized (missing/invalid auth)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

## Rate Limiting

API requests are rate limited:
- **Authenticated**: 1000 requests per hour
- **Unauthenticated**: 100 requests per hour

Rate limit headers:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## Webhooks

### Frame Events

Subscribe to frame events:

```http
POST /api/webhooks/subscribe
```

**Request Body:**
```json
{
  "url": "https://your-domain.com/webhook",
  "events": ["frame.created", "frame.updated", "frame.deleted"]
}
```

### Event Types

- `frame.created` - New frame created
- `frame.updated` - Frame updated
- `frame.deleted` - Frame deleted
- `payment.completed` - Payment successful
- `payment.failed` - Payment failed

### Webhook Payload

```json
{
  "event": "frame.created",
  "timestamp": "2024-01-01T00:00:00Z",
  "data": {
    "id": "frame_123",
    "title": "My Frame"
  }
}
```

## Client Examples

### JavaScript/TypeScript (fetch)

```typescript
// Example: Create a frame
const response = await fetch('https://your-domain.com/api/frames', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'My Frame',
    type: 'token-launch',
  })
});

const frame = await response.json();

// Example: Get analytics
const analyticsResponse = await fetch(`https://your-domain.com/api/analytics/frames/${frame.id}`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const analytics = await analyticsResponse.json();
```

### cURL

```bash
curl -X POST https://your-domain.com/api/frames \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Frame",
    "type": "token-launch"
  }'
```

### Python

```python
import requests

headers = {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json'
}

data = {
    'title': 'My Frame',
    'type': 'token-launch'
}

response = requests.post(
    'https://your-domain.com/api/frames',
    headers=headers,
    json=data
)
```

## Testing

### Test Environment

Use test API keys for development:

```
Test Base URL: https://test-api.your-domain.com/api
```

**NOTE:** API implementation and test environment setup are not included in the current release.

## Support

- API issues: api-support@aifarcaster.com
- Rate limit increases: enterprise@aifarcaster.com
- [Join Discord](https://discord.gg/aifarcaster)

## Changelog

### v1.0.0 (2024-01-01)
- Initial API release
- Frame management endpoints
- Template operations
- Payment integration
- Analytics endpoints
