# REST API Specification - Phase II

**Document Date:** December 28, 2024
**API Version:** 2.0.0
**Status:** Specification

---

## 1. API Overview

### Base URLs

| Environment | URL |
|-------------|-----|
| Development | `http://localhost:8000` |
| Staging | `https://staging-api.example.com` |
| Production | `https://api.example.com` |

### Protocol

- **Format:** JSON (application/json)
- **Security:** HTTPS/TLS (production)
- **Authentication:** JWT Bearer token
- **CORS:** Enabled for frontend origin

### Rate Limiting

- **General endpoints:** 100 requests/minute per IP
- **Auth endpoints:** 10 requests/minute per IP
- **Headers:** X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset

---

## 2. Authentication

### JWT Token Requirements

All requests (except auth endpoints) require:

```
Authorization: Bearer <JWT_TOKEN>
```

**JWT Payload Structure:**
```json
{
  "sub": "user-uuid-here",
  "email": "user@example.com",
  "iat": 1703804800,
  "exp": 1703891200
}
```

**Token Expiration:** 7 days
**Refresh Strategy:** Automatic on next request if expired

### CORS Headers

```
Access-Control-Allow-Origin: https://frontend.example.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

---

## 3. Health & Status Endpoints

### GET /api/health

Health check endpoint.

**Authentication:** Not required

**Response (200 OK):**
```json
{
  "status": "healthy",
  "timestamp": "2024-12-28T20:00:00Z",
  "version": "2.0.0"
}
```

**Response (503 Service Unavailable):**
```json
{
  "status": "unhealthy",
  "error": "Database connection failed"
}
```

---

## 4. Authentication Endpoints

### POST /api/auth/signup

Register a new user account.

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Validation Rules:**
- email: Valid email format, unique in database
- password: Minimum 8 characters, must contain uppercase and number
- name: Optional, max 255 characters

**Response (201 Created):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "name": "John Doe",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 604800
}
```

**Response (400 Bad Request):**
```json
{
  "status": "error",
  "code": "VALIDATION_ERROR",
  "message": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Email already registered"
    },
    {
      "field": "password",
      "message": "Password must contain at least one uppercase letter"
    }
  ]
}
```

**Response (500 Internal Server Error):**
```json
{
  "status": "error",
  "code": "SIGNUP_FAILED",
  "message": "Failed to create user account"
}
```

---

### POST /api/auth/signin

Authenticate user and retrieve JWT token.

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "name": "John Doe",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 604800
}
```

**Response (401 Unauthorized):**
```json
{
  "status": "error",
  "code": "INVALID_CREDENTIALS",
  "message": "Email or password is incorrect"
}
```

**Response (400 Bad Request):**
```json
{
  "status": "error",
  "code": "VALIDATION_ERROR",
  "message": "Email and password are required"
}
```

---

### POST /api/auth/signout

Invalidate user session (logout).

**Authentication:** Required (Bearer token)

**Request Body:**
```json
{}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "Successfully logged out"
}
```

**Response (401 Unauthorized):**
```json
{
  "status": "error",
  "code": "UNAUTHORIZED",
  "message": "Invalid or missing authentication token"
}
```

---

### POST /api/auth/refresh

Refresh JWT token.

**Authentication:** Required (Bearer token)

**Request Body:**
```json
{}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 604800
}
```

**Response (401 Unauthorized):**
```json
{
  "status": "error",
  "code": "UNAUTHORIZED",
  "message": "Token refresh failed"
}
```

---

### GET /api/auth/me

Get current authenticated user details.

**Authentication:** Required (Bearer token)

**Response (200 OK):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": "2024-12-28T10:00:00Z"
}
```

**Response (401 Unauthorized):**
```json
{
  "status": "error",
  "code": "UNAUTHORIZED",
  "message": "Invalid or missing authentication token"
}
```

---

## 5. Task Endpoints

### GET /api/tasks

List all tasks for authenticated user.

**Authentication:** Required (Bearer token)

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| status | string | "all" | Filter: "all", "pending", "completed" |
| sort | string | "created" | Sort by: "created", "title", "updated" |
| limit | integer | 20 | Number of items per page (max 100) |
| offset | integer | 0 | Number of items to skip (pagination) |

**Example Request:**
```
GET /api/tasks?status=pending&sort=created&limit=20&offset=0
Authorization: Bearer <TOKEN>
```

**Response (200 OK):**
```json
{
  "items": [
    {
      "id": 1,
      "title": "Buy Groceries",
      "description": "Milk, eggs, bread, butter",
      "completed": false,
      "createdAt": "2024-12-28T10:00:00Z",
      "updatedAt": "2024-12-28T10:00:00Z"
    },
    {
      "id": 2,
      "title": "Complete Project",
      "description": "Finish Phase II implementation",
      "completed": true,
      "createdAt": "2024-12-27T15:30:00Z",
      "updatedAt": "2024-12-28T18:45:00Z"
    }
  ],
  "total": 2,
  "limit": 20,
  "offset": 0
}
```

**Response (401 Unauthorized):**
```json
{
  "status": "error",
  "code": "UNAUTHORIZED",
  "message": "Invalid or missing authentication token"
}
```

---

### POST /api/tasks

Create a new task.

**Authentication:** Required (Bearer token)

**Request Body:**
```json
{
  "title": "Buy Groceries",
  "description": "Milk, eggs, bread, butter"
}
```

**Validation Rules:**
- title: Required, 1-255 characters
- description: Optional, max 1000 characters

**Response (201 Created):**
```json
{
  "id": 3,
  "title": "Buy Groceries",
  "description": "Milk, eggs, bread, butter",
  "completed": false,
  "createdAt": "2024-12-28T20:00:00Z",
  "updatedAt": "2024-12-28T20:00:00Z"
}
```

**Response (400 Bad Request):**
```json
{
  "status": "error",
  "code": "VALIDATION_ERROR",
  "message": "Validation failed",
  "details": [
    {
      "field": "title",
      "message": "Title is required and must be 1-255 characters"
    }
  ]
}
```

**Response (401 Unauthorized):**
```json
{
  "status": "error",
  "code": "UNAUTHORIZED",
  "message": "Invalid or missing authentication token"
}
```

---

### GET /api/tasks/{id}

Get task details.

**Authentication:** Required (Bearer token)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Task ID |

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "Buy Groceries",
  "description": "Milk, eggs, bread, butter",
  "completed": false,
  "createdAt": "2024-12-28T10:00:00Z",
  "updatedAt": "2024-12-28T10:00:00Z"
}
```

**Response (401 Unauthorized):**
```json
{
  "status": "error",
  "code": "UNAUTHORIZED",
  "message": "Invalid or missing authentication token"
}
```

**Response (403 Forbidden):**
```json
{
  "status": "error",
  "code": "FORBIDDEN",
  "message": "You do not have permission to access this task"
}
```

**Response (404 Not Found):**
```json
{
  "status": "error",
  "code": "NOT_FOUND",
  "message": "Task not found"
}
```

---

### PUT /api/tasks/{id}

Update a task completely (replace all fields).

**Authentication:** Required (Bearer token)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Task ID |

**Request Body:**
```json
{
  "title": "Buy Groceries - Updated",
  "description": "Milk, eggs, bread, butter, cheese",
  "completed": false
}
```

**Validation Rules:**
- At least one field must be provided
- title: 1-255 characters if provided
- description: max 1000 characters if provided
- completed: boolean

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "Buy Groceries - Updated",
  "description": "Milk, eggs, bread, butter, cheese",
  "completed": false,
  "createdAt": "2024-12-28T10:00:00Z",
  "updatedAt": "2024-12-28T21:00:00Z"
}
```

**Response (400 Bad Request):**
```json
{
  "status": "error",
  "code": "VALIDATION_ERROR",
  "message": "Title must be 1-255 characters"
}
```

**Response (401 Unauthorized):**
```json
{
  "status": "error",
  "code": "UNAUTHORIZED",
  "message": "Invalid or missing authentication token"
}
```

**Response (403 Forbidden):**
```json
{
  "status": "error",
  "code": "FORBIDDEN",
  "message": "You do not have permission to update this task"
}
```

**Response (404 Not Found):**
```json
{
  "status": "error",
  "code": "NOT_FOUND",
  "message": "Task not found"
}
```

---

### PATCH /api/tasks/{id}

Partial task update (only provided fields are updated).

**Authentication:** Required (Bearer token)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Task ID |

**Request Body:**
```json
{
  "completed": true
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "Buy Groceries",
  "description": "Milk, eggs, bread, butter",
  "completed": true,
  "createdAt": "2024-12-28T10:00:00Z",
  "updatedAt": "2024-12-28T21:30:00Z"
}
```

**Response (401 Unauthorized):**
```json
{
  "status": "error",
  "code": "UNAUTHORIZED",
  "message": "Invalid or missing authentication token"
}
```

**Response (403 Forbidden):**
```json
{
  "status": "error",
  "code": "FORBIDDEN",
  "message": "You do not have permission to update this task"
}
```

**Response (404 Not Found):**
```json
{
  "status": "error",
  "code": "NOT_FOUND",
  "message": "Task not found"
}
```

---

### PATCH /api/tasks/{id}/complete

Toggle task completion status.

**Authentication:** Required (Bearer token)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Task ID |

**Request Body:**
```json
{}
```

**Behavior:**
- If completed is false → set to true
- If completed is true → set to false

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "Buy Groceries",
  "description": "Milk, eggs, bread, butter",
  "completed": true,
  "createdAt": "2024-12-28T10:00:00Z",
  "updatedAt": "2024-12-28T21:45:00Z"
}
```

**Response (401 Unauthorized):**
```json
{
  "status": "error",
  "code": "UNAUTHORIZED",
  "message": "Invalid or missing authentication token"
}
```

**Response (403 Forbidden):**
```json
{
  "status": "error",
  "code": "FORBIDDEN",
  "message": "You do not have permission to update this task"
}
```

**Response (404 Not Found):**
```json
{
  "status": "error",
  "code": "NOT_FOUND",
  "message": "Task not found"
}
```

---

### DELETE /api/tasks/{id}

Delete a task.

**Authentication:** Required (Bearer token)

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | Task ID |

**Response (204 No Content):**
```
[Empty body]
```

**Response (401 Unauthorized):**
```json
{
  "status": "error",
  "code": "UNAUTHORIZED",
  "message": "Invalid or missing authentication token"
}
```

**Response (403 Forbidden):**
```json
{
  "status": "error",
  "code": "FORBIDDEN",
  "message": "You do not have permission to delete this task"
}
```

**Response (404 Not Found):**
```json
{
  "status": "error",
  "code": "NOT_FOUND",
  "message": "Task not found"
}
```

---

## 6. Error Handling

### Standard Error Response Format

All errors follow this structure:

```json
{
  "status": "error",
  "code": "ERROR_CODE",
  "message": "Human-readable message",
  "details": [
    {
      "field": "fieldName",
      "message": "Field-specific error"
    }
  ],
  "timestamp": "2024-12-28T20:00:00Z"
}
```

### HTTP Status Codes

| Status | Name | When Used |
|--------|------|-----------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Validation failed |
| 401 | Unauthorized | Missing/invalid JWT token |
| 403 | Forbidden | User isolation violation |
| 404 | Not Found | Resource doesn't exist |
| 429 | Too Many Requests | Rate limited |
| 500 | Internal Server Error | Unexpected error |
| 503 | Service Unavailable | Database down |

### Error Codes

| Code | Meaning | HTTP Status |
|------|---------|-------------|
| VALIDATION_ERROR | Input validation failed | 400 |
| UNAUTHORIZED | Missing/invalid JWT token | 401 |
| FORBIDDEN | User doesn't own resource | 403 |
| NOT_FOUND | Resource doesn't exist | 404 |
| DUPLICATE_EMAIL | Email already registered | 400 |
| INVALID_CREDENTIALS | Email/password incorrect | 401 |
| TOKEN_EXPIRED | JWT token expired | 401 |
| RATE_LIMIT_EXCEEDED | Too many requests | 429 |
| DATABASE_ERROR | Database operation failed | 500 |
| INTERNAL_ERROR | Unexpected error | 500 |

---

## 7. API Client Examples

### JavaScript/TypeScript (axios)

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Sign in
const response = await api.post('/auth/signin', {
  email: 'user@example.com',
  password: 'password'
});
localStorage.setItem('token', response.data.token);

// Get tasks
const tasks = await api.get('/tasks?status=pending');

// Create task
const newTask = await api.post('/tasks', {
  title: 'Buy Groceries',
  description: 'Milk, eggs, bread'
});

// Update task
const updated = await api.put(`/tasks/${newTask.id}`, {
  completed: true
});

// Delete task
await api.delete(`/tasks/${newTask.id}`);
```

### Python (requests)

```python
import requests

BASE_URL = "http://localhost:8000"

# Sign in
response = requests.post(
    f"{BASE_URL}/auth/signin",
    json={
        "email": "user@example.com",
        "password": "password"
    }
)
token = response.json()["token"]

headers = {"Authorization": f"Bearer {token}"}

# Get tasks
tasks = requests.get(
    f"{BASE_URL}/tasks?status=pending",
    headers=headers
)

# Create task
new_task = requests.post(
    f"{BASE_URL}/tasks",
    headers=headers,
    json={
        "title": "Buy Groceries",
        "description": "Milk, eggs, bread"
    }
)

# Update task
updated = requests.patch(
    f"{BASE_URL}/tasks/{new_task.json()['id']}",
    headers=headers,
    json={"completed": True}
)

# Delete task
requests.delete(
    f"{BASE_URL}/tasks/{new_task.json()['id']}",
    headers=headers
)
```

### cURL

```bash
# Sign in
curl -X POST http://localhost:8000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# Response contains token, set it:
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Get tasks
curl -X GET "http://localhost:8000/api/tasks?status=pending" \
  -H "Authorization: Bearer $TOKEN"

# Create task
curl -X POST http://localhost:8000/api/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Buy Groceries","description":"Milk, eggs, bread"}'

# Mark task complete
curl -X PATCH http://localhost:8000/api/tasks/1/complete \
  -H "Authorization: Bearer $TOKEN"

# Delete task
curl -X DELETE http://localhost:8000/api/tasks/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

## 8. OpenAPI/Swagger Documentation

Auto-generated at `/docs` endpoint:

```
http://localhost:8000/docs
```

FastAPI automatically generates interactive Swagger UI for testing endpoints.

---

**Document Status:** SPECIFICATION
**Last Updated:** December 28, 2024

