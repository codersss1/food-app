# FoodHub - Complete Authentication System

A full-stack food delivery application with complete authentication system supporting email/password login and Google OAuth.

## Features Implemented

### ✅ Authentication Features
- **Email/Password Registration** - Create account with email, password, name, and phone
- **Email/Password Login** - Sign in with credentials
- **Google OAuth** - One-click Google sign-in and sign-up
- **Session Management** - Secure JWT-based sessions with NextAuth.js
- **Protected Routes** - Middleware-based route protection
- **User Profile** - Access to user profile menu with logout

### ✅ Security Features
- Password hashing with bcryptjs (10 salt rounds)
- HTTP-only secure cookies for session management
- CSRF protection with NextAuth.js
- Input validation on both frontend and backend
- MongoDB integration for persistent user storage
- Environment variable management for sensitive data

### ✅ User Experience
- Beautiful, responsive login/signup pages
- Form validation with error messages
- Loading states and spinners
- Automatic redirect after login
- User profile menu with quick links
- Logout functionality

## Project Structure

```
/
├── app/
│   ├── auth/
│   │   ├── login/page.tsx          # Login page with Google OAuth
│   │   ├── signup/page.tsx         # Signup page with form validation
│   │   └── ...
│   ├── (app)/
│   │   ├── home/page.tsx           # Protected home page
│   │   ├── profile/page.tsx        # User profile
│   │   ├── orders/page.tsx         # Order history
│   │   └── ...
│   ├── api/
│   │   └── auth/
│   │       ├── [...nextauth]/route.ts   # NextAuth API routes
│   │       └── register/route.ts        # Custom registration endpoint
│   ├── layout.tsx                  # Root layout with SessionProvider
│   └── globals.css
├── auth.ts                         # NextAuth configuration
├── middleware.ts                   # Route protection middleware
├── lib/
│   ├── mongodb.ts                  # MongoDB client
│   ├── api.ts                      # API utilities
│   └── utils.ts
├── hooks/
│   └── use-auth.ts                 # useAuth hook for client components
├── components/
│   ├── UserMenu.tsx               # User dropdown menu
│   ├── ProtectedRoute.tsx          # Protected route wrapper
│   └── ui/                         # shadcn/ui components
├── backend/
│   ├── models/
│   │   ├── User.js                # MongoDB User schema
│   │   └── ...
│   ├── controllers/
│   ├── routes/
│   └── ...
├── AUTHENTICATION_SETUP.md         # Complete setup guide
└── .env.example                    # Environment variables template
```

## Key Technologies

- **Frontend**: Next.js 16, React 19, TypeScript
- **Authentication**: NextAuth.js 5, Google OAuth
- **Backend**: Express.js, MongoDB, Mongoose
- **Security**: bcryptjs, JWT tokens
- **UI**: shadcn/ui, Tailwind CSS
- **Database**: MongoDB (local or Atlas)

## Files Created/Modified

### New Files
```
✅ auth.ts                         - NextAuth configuration
✅ lib/mongodb.ts                  - MongoDB client connection
✅ app/api/auth/[...nextauth]/route.ts
✅ app/api/auth/register/route.ts
✅ hooks/use-auth.ts              - Auth hook for components
✅ components/ProtectedRoute.tsx
✅ components/UserMenu.tsx
✅ middleware.ts                  - Protected route middleware
✅ AUTHENTICATION_SETUP.md        - Detailed setup guide
✅ .env.example                   - Environment template
```

### Modified Files
```
📝 package.json                   - Added NextAuth dependencies
📝 app/layout.tsx                - Added SessionProvider
📝 app/auth/login/page.tsx       - Integrated NextAuth with Google OAuth
📝 app/auth/signup/page.tsx      - Integrated registration with form
📝 app/(app)/home/page.tsx       - Added user welcome message
```

## Quick Start

### 1. Clone and Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd foodhub

# Install dependencies
pnpm install
```

### 2. Configure Environment
```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your settings:
# - MONGODB_URI (MongoDB connection string)
# - NEXTAUTH_SECRET (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
# - GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET (from Google Cloud Console)
```

### 3. Setup Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`
4. Add credentials to `.env.local`

### 4. Start Development Server
```bash
pnpm dev
```

Visit `http://localhost:3000` in your browser.

## Authentication Flow

### Email/Password Login
```
User enters email/password
          ↓
Form validates input
          ↓
NextAuth Credentials Provider
          ↓
Backend validates password hash
          ↓
JWT session created
          ↓
Redirect to home page
```

### Google OAuth Login
```
User clicks "Sign in with Google"
          ↓
Redirected to Google consent screen
          ↓
User approves permissions
          ↓
Google redirects with code
          ↓
NextAuth exchanges code for profile
          ↓
Check if user exists in database
          ↓
Create user if new, update if existing
          ↓
JWT session created
          ↓
Redirect to home page
```

## Using Authentication

### In Client Components
```tsx
'use client'
import { useAuth } from '@/hooks/use-auth'

export function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth()
  
  if (!isAuthenticated) return <div>Not logged in</div>
  
  return (
    <div>
      <p>Welcome, {user?.name}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

### In Server Components
```tsx
import { auth } from '@/auth'

export default async function Page() {
  const session = await auth()
  
  if (!session) {
    return redirect('/auth/login')
  }
  
  return <div>Welcome, {session.user?.name}!</div>
}
```

### Protected API Routes
```tsx
import { auth } from '@/auth'

export async function GET(request: NextRequest) {
  const session = await auth()
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // Use session.user for protected logic
  return NextResponse.json({ message: 'Protected data' })
}
```

## Testing

### Test Email/Password
1. Go to `http://localhost:3000/auth/signup`
2. Register with test account
3. Go to `http://localhost:3000/auth/login`
4. Login with registered credentials
5. Should be redirected to home page

### Test Google OAuth
1. Go to `http://localhost:3000/auth/login` or signup page
2. Click "Sign in/up with Google"
3. Complete Google authentication
4. Should be redirected to home page
5. User created automatically in database

### Test Protected Routes
1. Try accessing `http://localhost:3000/(app)/profile` without logging in
2. Should redirect to login page
3. After logging in, should access profile page

## Deployment

### Deploy to Vercel
```bash
# Push to GitHub
git add .
git commit -m "Add complete authentication system"
git push origin main

# Deploy with Vercel CLI or UI
vercel
```

### Environment Variables on Vercel
```
MONGODB_URI=<your-mongodb-uri>
NEXTAUTH_SECRET=<generated-secret>
NEXTAUTH_URL=https://<your-vercel-domain>
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
NEXT_PUBLIC_API_URL=<your-api-url>
```

## API Endpoints

### Authentication Routes
- `GET /api/auth/signin` - Sign in page
- `POST /api/auth/callback/credentials` - Credentials login
- `POST /api/auth/callback/google` - Google OAuth callback
- `GET /api/auth/session` - Get current session
- `POST /api/auth/signout` - Sign out
- `GET /api/auth/providers` - Available providers
- `POST /api/auth/register` - Register new user

## Security Best Practices

✅ **Implemented:**
- Password hashing with bcryptjs
- Secure session cookies (HTTP-only)
- CSRF protection with NextAuth
- Input validation and sanitization
- Environment variables for secrets
- MongoDB user persistence
- Rate limiting ready (add with express-rate-limit)

🔒 **Recommended Additional:**
- Email verification flow
- Password reset functionality
- Two-factor authentication (2FA)
- Rate limiting on auth endpoints
- Email notifications for security events
- Session timeout configuration
- IP-based security measures

## Troubleshooting

### Session Not Persisting
- Check `NEXTAUTH_SECRET` is set correctly
- Verify `NEXTAUTH_URL` matches your domain
- Clear browser cookies and try again

### Google OAuth Not Working
- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
- Check redirect URIs are properly configured in Google Cloud Console
- Ensure OAuth consent screen is properly set up

### MongoDB Connection Failed
- Verify `MONGODB_URI` is correct
- Check MongoDB is running (local) or accessible (Atlas)
- Verify IP whitelist for MongoDB Atlas

### Login Loops
- Check user exists in database
- Verify password is hashed correctly
- Ensure session callback is working
- Check console logs for detailed errors

## Database Migrations

No manual migrations needed! The system uses:
- **Mongoose schemas** - Auto-create collections
- **NextAuth MongoDB Adapter** - Auto-creates auth tables
- **Pre-save hooks** - Auto-hash passwords

## Next Steps

1. Customize branding and colors
2. Add email verification
3. Implement password reset
4. Add user profile editing
5. Set up email notifications
6. Add role-based access control
7. Implement refresh token strategy
8. Add audit logging

## License

MIT License - Feel free to use this for your projects!

## Support

For detailed setup instructions, see `AUTHENTICATION_SETUP.md`

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**NextAuth**: 5.0.0  
**Next.js**: 16.2.0
