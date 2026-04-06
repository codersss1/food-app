# Authentication Setup Guide

This guide will help you set up the complete authentication system with NextAuth.js, Google OAuth, and email/password login.

## Prerequisites

- Node.js 18+ and npm/pnpm
- MongoDB instance (local or Atlas)
- Google OAuth credentials
- Vercel account (for deployment)

## Step 1: Environment Setup

### 1.1 Create `.env.local` file

Copy the `.env.example` file to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

### 1.2 MongoDB Connection

**Option A: Local MongoDB**
```bash
# Install MongoDB locally
# Then set:
MONGODB_URI=mongodb://localhost:27017/foodhub
```

**Option B: MongoDB Atlas (Cloud)**
1. Create a cluster at https://www.mongodb.com/cloud/atlas
2. Create a database user
3. Get your connection string
4. Update `.env.local`:
```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/foodhub?retryWrites=true&w=majority
```

### 1.3 NextAuth Secret

Generate a secure secret:

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Add to `.env.local`:
```
NEXTAUTH_SECRET=<your-generated-secret>
```

## Step 2: Google OAuth Setup

### 2.1 Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable OAuth 2.0 consent screen:
   - Go to "OAuth consent screen"
   - Choose "External" user type
   - Fill in required information
4. Create OAuth 2.0 credentials:
   - Go to "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (development)
     - `https://yourdomain.com/api/auth/callback/google` (production)
5. Copy Client ID and Client Secret

### 2.2 Add to `.env.local`

```
GOOGLE_CLIENT_ID=<your-client-id>
GOOGLE_CLIENT_SECRET=<your-client-secret>
```

## Step 3: NextAuth URL Configuration

Update `.env.local`:

```
# Development
NEXTAUTH_URL=http://localhost:3000

# Production (update after deployment)
NEXTAUTH_URL=https://yourdomain.com
```

## Step 4: Install Dependencies

```bash
pnpm install
```

This will install:
- `next-auth` - Authentication library
- `@auth/core` - Core authentication logic
- `@auth/mongodb-adapter` - MongoDB adapter for NextAuth
- `bcryptjs` - Password hashing (already included)

## Step 5: Run the Application

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

## Step 6: Test Authentication

### 6.1 Email/Password Registration
1. Go to `http://localhost:3000/auth/signup`
2. Fill in the registration form with:
   - Full Name
   - Email
   - Phone Number
   - Password (min 6 characters)
3. Click "Create Account"

### 6.2 Email/Password Login
1. Go to `http://localhost:3000/auth/login`
2. Enter your email and password
3. Click "Sign In"

### 6.3 Google OAuth Login
1. Go to `http://localhost:3000/auth/login` or signup page
2. Click "Sign in with Google"
3. Complete Google authentication
4. User account will be created automatically

## Step 7: API Endpoints

### Authentication Routes
- `POST /api/auth/signin` - NextAuth sign in
- `POST /api/auth/callback/google` - Google OAuth callback
- `POST /api/auth/callback/credentials` - Credentials provider callback
- `GET /api/auth/session` - Get current session
- `POST /api/auth/signout` - Sign out user
- `POST /api/auth/register` - Register new user (custom endpoint)

## Step 8: Using Authentication in Components

### Check User Session
```tsx
'use client'
import { useAuth } from '@/hooks/use-auth'

export function MyComponent() {
  const { user, isAuthenticated, isLoading } = useAuth()
  
  if (isLoading) return <div>Loading...</div>
  if (!isAuthenticated) return <div>Not logged in</div>
  
  return <div>Welcome, {user?.name}!</div>
}
```

### Use in Server Components
```tsx
import { auth } from '@/auth'

export default async function Page() {
  const session = await auth()
  
  if (!session) {
    return <div>Not authenticated</div>
  }
  
  return <div>Welcome, {session.user?.name}!</div>
}
```

### Logout
```tsx
import { useAuth } from '@/hooks/use-auth'

export function LogoutButton() {
  const { logout } = useAuth()
  
  return <button onClick={logout}>Logout</button>
}
```

## Step 9: Deployment to Vercel

### 9.1 Push to GitHub
```bash
git init
git add .
git commit -m "Add authentication system"
git remote add origin https://github.com/yourusername/repo.git
git push -u origin main
```

### 9.2 Deploy to Vercel
1. Go to [Vercel](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Add environment variables:
   - `MONGODB_URI`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (use Vercel domain)
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
5. Click "Deploy"

### 9.3 Update Google OAuth
1. Go to Google Cloud Console
2. Update authorized redirect URI:
   - Add `https://<your-vercel-domain>/api/auth/callback/google`

## Troubleshooting

### "Google OAuth provider not initialized"
- Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set
- Verify they're not in `.env.local` but in environment variables

### "MongoDB connection failed"
- Ensure `MONGODB_URI` is correct
- Check MongoDB is running (if local)
- Verify IP whitelist in MongoDB Atlas (if cloud)

### "Session not persisting"
- Clear browser cookies
- Ensure `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain

### "Login redirects back to login page"
- Verify user exists in database
- Check password hash is correct
- Ensure session callback is working

## Database Schema

The User model includes:
- `email` - Unique user email
- `passwordHash` - Hashed password
- `fullName` - User's full name
- `phone` - Phone number
- `avatar` - Profile picture URL
- `isVerified` - Email verification status
- `studentId` - Student ID (for LPU)
- `isLpuStudent` - LPU student flag
- `timestamps` - Created/updated dates

## Security Notes

1. **Never commit `.env.local`** - Use `.env.example` for templates
2. **Use HTTPS in production** - Required for OAuth and session cookies
3. **Secure `NEXTAUTH_SECRET`** - Use a strong, random 32+ character string
4. **Validate inputs** - All form inputs are validated on backend
5. **Hash passwords** - Passwords are hashed with bcryptjs (salt rounds: 10)
6. **CORS configured** - Backend CORS allows frontend origin

## Next Steps

1. Customize login/signup pages with your branding
2. Add email verification flow
3. Implement password reset functionality
4. Add two-factor authentication
5. Set up role-based access control (RBAC)
6. Configure email notifications

## Support

For issues or questions:
- Check [NextAuth.js documentation](https://next-auth.js.org)
- Review [MongoDB Adapter docs](https://authjs.dev/guides/adapters/mongodb)
- Check console logs for errors

---

**Last Updated:** 2024
**NextAuth Version:** 5.0.0
**Next.js Version:** 16.2.0
