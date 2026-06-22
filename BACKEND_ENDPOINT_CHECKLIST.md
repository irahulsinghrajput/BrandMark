# Backend Implementation Checklist - Phase 1 Final Steps

## Status: FRONTEND 100% COMPLETE | BACKEND PARTIAL

Admin auth refactoring is complete on the frontend. The backend needs these endpoints to fully enable the new authentication flow:

---

## Backend Endpoints Still Needed

### 1. ✅ GET /api/csrf-token
**Status**: Already exists in server.js
**Purpose**: Provides single-use CSRF tokens to clients
**Implementation**: Lines 75-85 in backend/server.js

### 2. ✅ POST /api/admin/login
**Status**: Exists but needs modification
**Current**: Returns `{ success: true, token: "..." }`
**Needed**: Should set httpOnly cookie instead of returning token
**Action**: Modify to:
```javascript
res.cookie('authToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
});
res.json({ success: true, message: 'Login successful' });
```

### 3. ⭕ POST /api/admin/logout [NEW]
**Status**: DOES NOT EXIST - NEEDS TO BE CREATED
**Purpose**: Clears the httpOnly authentication cookie
**Implementation**:
```javascript
app.post('/api/admin/logout', (req, res) => {
    res.clearCookie('authToken');
    res.json({ success: true, message: 'Logged out' });
});
```

### 4. ⭕ GET /api/admin/verify [NEW]
**Status**: DOES NOT EXIST - NEEDS TO BE CREATED
**Purpose**: Verifies if user has valid authentication cookie
**Implementation**:
```javascript
app.get('/api/admin/verify', (req, res) => {
    // Check if authToken cookie exists and is valid
    const token = req.cookies.authToken;
    
    if (!token) {
        return res.json({ authenticated: false });
    }
    
    // Verify token validity (JWT or database lookup)
    // This depends on your authentication implementation
    
    res.json({ authenticated: true });
});
```

---

## Deployment Steps

1. **Update /api/admin/login endpoint**:
   - Find current implementation in backend/server.js
   - Change from token response to httpOnly cookie
   - Add cookie options (httpOnly, secure, sameSite)

2. **Create /api/admin/logout endpoint**:
   - Add POST route
   - Clear 'authToken' cookie
   - Return success response

3. **Create /api/admin/verify endpoint**:
   - Add GET route
   - Check for authToken cookie
   - Return authentication status
   - Include CSRF validation middleware

4. **Test Flow**:
   - Clear all cookies
   - Navigate to admin-dashboard.html
   - Should show login form
   - Login with valid credentials
   - Should show dashboard
   - Refresh page - should still show dashboard (cookie persists)
   - Click logout
   - Should return to login form
   - Refresh page - should still show login form (cookie cleared)

5. **Security Verification**:
   - Check DevTools → Application → Cookies
   - Verify authToken has:
     - ✅ HttpOnly flag (checked)
     - ✅ Secure flag (checked on HTTPS)
     - ✅ SameSite=Strict
   - Verify authToken NOT accessible via JavaScript

---

## Cookie Configuration Example

```javascript
res.cookie('authToken', jwtToken, {
    httpOnly: true,                                    // Not accessible via JS
    secure: process.env.NODE_ENV === 'production',    // Only on HTTPS in production
    sameSite: 'strict',                                // CSRF protection
    path: '/',                                         // Available site-wide
    maxAge: 24 * 60 * 60 * 1000                       // 24 hours expiry
});
```

---

## Environment Variables to Check

Ensure backend has these configured:

```
NODE_ENV=production (or development for local)
API_PORT=5001
CORS_ORIGIN=https://brandmarksolutions.site (or http://localhost:5500 for local)
```

---

## Expected After Implementation

✅ User logs in → authToken httpOnly cookie set on server
✅ User navigates dashboard → cookie automatically sent (credentials: 'include')
✅ Server validates cookie → provides data
✅ User logs out → server clears cookie
✅ Page refresh → no cookie → shows login form
✅ No auth token in localStorage or JavaScript accessible
✅ No auth token visible in any form data

---

## Estimated Completion Time

- Update login endpoint: **10 minutes**
- Create logout endpoint: **5 minutes**
- Create verify endpoint: **10 minutes**
- Testing: **15 minutes**
- **Total: ~40 minutes**

---

## After Completion

Phase 1 will be FULLY complete with:
- ✅ XSS prevention
- ✅ CSRF protection
- ✅ Secure admin authentication
- ✅ Security headers
- ✅ Input validation
- ✅ Rate limiting
- ✅ Broken links fixed
- ✅ Ready for production deployment

Then proceed to **Phase 2**: Navigation consolidation, course template system, performance optimization.
