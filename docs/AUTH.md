# Authentication

Sujalam uses stateless JWT authentication.

## Flow
1. **Register**: `POST /api/auth/register` (creates user and hashes password with bcrypt)
2. **Login**: `POST /api/auth/login` (verifies credentials, issues JWT valid for `JWT_EXPIRES_IN`)
3. **Session Check**: `GET /api/me` (requires Bearer token, returns current user data)
4. **Logout**: `POST /api/auth/logout` (client discards token)

## Middleware
The `authenticate` middleware verifies the JWT signature and injects `req.user.user_id` into the Express request context.

## Authorization
All endpoints accessing farm resources MUST invoke `assertFarmOwnership(userId, farmId)` to prevent cross-user data leakage.
