# Authentication System - Quick Start Guide

## 60-Second Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Create .env.local (copy from .env.example)
cp .env.example .env.local

# 3. Add your MongoDB URI to .env.local
# MONGODB_URI=mongodb://localhost:27017/foodhub
# (or MongoDB Atlas connection string)

# 4. Generate NextAuth secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Copy the output and add as NEXTAUTH_SECRET to .env.local

# 5. Start development server
pnpm dev
```

## .env.local Configuration

Minimum required (copy from .env.example and fill in):

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/foodhub

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate-with-node-command-above>

# Google OAuth (get from Google Cloud Console)
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

## Test It

### Register New User
1. Open http://localhost:3000/auth/signup
2. Fill form and submit
3. Auto-redirected to home page

### Login with Email
1. Open http://localhost:3000/auth/login
2. Enter email and password
3. Auto-redirected to home page

### Login with Google
1. Click "Sign in with Google" button
2. Approve permissions
3. Auto-redirected to home page

### Logout
1. Click user menu (top right)
2. Click "Sign Out"
3. Redirected to login page

## Key Files

| File | Purpose |
|------|---------|
| `auth.ts` | NextAuth configuration |
| `app/api/auth/[...nextauth]/route.ts` | Auth API routes |
| `app/api/auth/register/route.ts` | User registration endpoint |
| `app/auth/login/page.tsx` | Login page |
| `app/auth/signup/page.tsx` | Signup page |
| `hooks/use-auth.ts` | Auth hook for components |
| `middleware.ts` | Route protection |
| `lib/mongodb.ts` | Database connection |

## Using Auth in Components

### Get Current User
```tsx
'use client'
import { useAuth } from '@/hooks/use-auth'

export function MyComponent() {
  const { user, isAuthenticated } = useAuth()
  
  if (!isAuthenticated) return <p>Not logged in</p>
  return <p>Hello, {user?.name}!</p>
}
```

### Protect a Route
```tsx
import { ProtectedRoute } from '@/components/ProtectedRoute'

export default function ProtectedPage() {
  return (
    <ProtectedRoute>
      <h1>Protected Content</h1>
    </ProtectedRoute>
  )
}
```

### Logout
```tsx
import { useAuth } from '@/hooks/use-auth'

export function LogoutButton() {
  const { logout } = useAuth()
  return (
    <button onClick={logout}>
      Sign Out
    </button>
  )
}
```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project
3. Enable OAuth consent screen
4. Create OAuth credentials:
   - Type: Web Application
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google`
5. Copy Client ID and Secret to .env.local

## Database Setup

### Option A: Local MongoDB
```bash
# Install MongoDB
# macOS: brew install mongodb-community
# Windows: Download from mongodb.com

# Start MongoDB
brew services start mongodb-community

# Connection string in .env.local:
MONGODB_URI=mongodb://localhost:27017/foodhub
```

### Option B: MongoDB Atlas (Cloud)
1. Create account at mongodb.com
2. Create cluster
3. Create database user
4. Get connection string
5. Add to .env.local:
```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/foodhub?retryWrites=true&w=majority
```

## Routes

### Auth Routes (Public)
- `GET /auth/login` - Login page
- `GET /auth/signup` - Signup page

### Protected Routes (Require Login)
- `GET /(app)/home` - Home page
- `GET /(app)/profile` - User profile
- `GET /(app)/orders` - Order history
- `GET /(app)/cart` - Shopping cart

### API Routes
- `POST /api/auth/register` - Create account
- `POST /api/auth/signin` - Login (NextAuth)
- `GET /api/auth/session` - Get session info
- `POST /api/auth/signout` - Logout
- `GET /api/auth/providers` - Get providers list

## Troubleshooting

### "NEXTAUTH_SECRET is missing"
Generate it:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Add to .env.local

### "MongoDB connection failed"
- Check MONGODB_URI is correct
- Ensure MongoDB is running
- For Atlas: check IP whitelist

### "Google login not working"
- Verify GOOGLE_CLIENT_ID and SECRET in .env.local
- Check redirect URI in Google Cloud Console matches
- Make sure OAuth consent screen is configured

### "Session not persisting"
- Check NEXTAUTH_SECRET is set
- Clear browser cookies
- Restart dev server

### "Stuck in login redirect loop"
- Check user exists in MongoDB
- Verify password is hashed correctly
- Check session callback in auth.ts

## Database Schema

User collection in MongoDB:
```javascript
{
  _id: ObjectId,
  email: string (unique),
  passwordHash: string (hashed),
  fullName: string,
  phone: string,
  avatar: string (URL),
  isVerified: boolean,
  isLpuStudent: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Common Tasks

### Add to Protected Page
```tsx
import { ProtectedRoute } from '@/components/ProtectedRoute'

export default function MyPage() {
  return (
    <ProtectedRoute>
      <h1>Protected Content</h1>
    </ProtectedRoute>
  )
}
```

### Show User Info
```tsx
'use client'
import { useAuth } from '@/hooks/use-auth'

export function UserInfo() {
  const { user } = useAuth()
  return <p>User: {user?.email}</p>
}
```

### Redirect if Not Logged In
```tsx
'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'

export function Component() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isLoading, isAuthenticated, router])
  
  if (isLoading) return <p>Loading...</p>
  return <h1>Your Content</h1>
}
```

## Deployment Checklist

- [ ] MongoDB connected (local or Atlas)
- [ ] NextAuth secret generated
- [ ] Google OAuth configured
- [ ] .env.local filled with all values
- [ ] `pnpm dev` runs without errors
- [ ] Can register new user
- [ ] Can login with email/password
- [ ] Can login with Google
- [ ] Can logout
- [ ] Protected routes redirect when logged out

## For Full Details

- Setup Guide: `AUTHENTICATION_SETUP.md`
- Project Overview: `README_AUTH.md`
- Implementation Details: `IMPLEMENTATION_SUMMARY.md`

---

**Ready to go!** Run `pnpm dev` and test the authentication system.
