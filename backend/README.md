# Backend API Documentation

This document provides information about the available API routes in the backend service.

## Authentication Routes

| Method | Endpoint               | Description           | Authentication | Role Required |
| ------ | ---------------------- | --------------------- | -------------- | ------------- |
| POST   | `/auth/register`       | Register a new user   | No             | None          |
| POST   | `/auth/login`          | Login user            | No             | None          |
| GET    | `/auth/me`             | Get current user info | Yes            | Any           |
| PATCH  | `/auth/verify/:userId` | Verify a user         | Yes            | govt_official |

## Scheme Routes

### Public Routes

| Method | Endpoint       | Description      | Authentication | Role Required |
| ------ | -------------- | ---------------- | -------------- | ------------- |
| GET    | `/schemes`     | Get all schemes  | No             | None          |
| GET    | `/schemes/:id` | Get scheme by ID | No             | None          |

### Protected Routes

| Method | Endpoint               | Description                           | Authentication | Role Required |
| ------ | ---------------------- | ------------------------------------- | -------------- | ------------- |
| GET    | `/schemes/eligible/me` | Get eligible schemes for current user | Yes            | Any           |

### Administrative Routes

| Method | Endpoint               | Description       | Authentication | Role Required      |
| ------ | ---------------------- | ----------------- | -------------- | ------------------ |
| POST   | `/schemes`             | Create new scheme | Yes            | govt_official, ngo |
| PUT    | `/schemes/:id`         | Update scheme     | Yes            | govt_official, ngo |
| DELETE | `/schemes/:id`         | Delete scheme     | Yes            | govt_official      |
| PATCH  | `/schemes/:id/approve` | Approve scheme    | Yes            | govt_official      |

## Authentication

Most endpoints require authentication via JWT token. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Roles

The system supports different user roles with varying levels of access:

- `govt_official`: Government officials with full administrative access
- `ngo`: NGO representatives who can create and update schemes
- Regular users: Can view schemes and check eligibility
