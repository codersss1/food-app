# Authentication System - Architecture & Flow Diagrams

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Next.js)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐         ┌──────────────────┐              │
│  │  Login Page      │         │  Signup Page     │              │
│  │  - Email form    │         │  - Registration  │              │
│  │  - Google button │         │  - Google button │              │
│  └────────┬─────────┘         └────────┬─────────┘              │
│           │                            │                         │
│           └─────────────┬──────────────┘                         │
│                         │                                        │
│                  ┌──────▼────────┐                              │
│                  │  useAuth Hook  │                              │
│                  │  - Session     │                              │
│                  │  - Login/out   │                              │
│                  └──────┬────────┘                              │
│                         │                                        │
│              ┌──────────┴──────────┐                             │
│              │                     │                             │
│         ┌────▼─────┐      ┌───────▼────┐                        │
│         │ Protected│      │  User Menu  │                        │
│         │  Routes  │      │  Component  │                        │
│         └──────────┘      └─────────────┘                        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/HTTPS
                            │
┌─────────────────────────────────────────────────────────────────┐
│                    NextAuth.js (Server)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │           NextAuth API Routes                           │   │
│  │  /api/auth/signin                                      │   │
│  │  /api/auth/callback/credentials                        │   │
│  │  /api/auth/callback/google                             │   │
│  │  /api/auth/session                                     │   │
│  │  /api/auth/signout                                     │   │
│  └────────────────────┬─────────────────────────────────┘   │
│                       │                                        │
│  ┌────────────────────▼──────────────────┐                    │
│  │  Providers                             │                    │
│  │  ├─ Credentials Provider               │                    │
│  │  │  ├─ Validate email/password         │                    │
│  │  │  └─ Check password hash             │                    │
│  │  └─ Google OAuth Provider              │                    │
│  │     ├─ Get Google profile              │                    │
│  │     └─ Create/update user              │                    │
│  └────────────────┬─────────────────────┘                     │
│                   │                                             │
│         ┌─────────┴──────────┐                                  │
│         │                    │                                  │
│    ┌────▼──────┐        ┌───▼─────────┐                       │
│    │ Callbacks │        │ Custom API  │                       │
│    │ - JWT     │        │ - Register  │                       │
│    │ - Session │        │ - Validate  │                       │
│    └───────────┘        └─────────────┘                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ MongoDB Driver
                            │
┌─────────────────────────────────────────────────────────────────┐
│                   DATABASE (MongoDB)                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ users Collection                                          │  │
│  │ ├─ _id (ObjectId)                                        │  │
│  │ ├─ email (String, Unique)                               │  │
│  │ ├─ passwordHash (String, Hashed)                        │  │
│  │ ├─ fullName (String)                                    │  │
│  │ ├─ phone (String)                                       │  │
│  │ ├─ avatar (String, URL)                                 │  │
│  │ ├─ isVerified (Boolean)                                 │  │
│  │ ├─ createdAt (Date)                                     │  │
│  │ └─ updatedAt (Date)                                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Email/Password Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                   │
│  1. User Registers                                              │
│  ┌────────────────────┐                                          │
│  │ Signup Page        │                                          │
│  │ • Full Name        │                                          │
│  │ • Email            │                                          │
│  │ • Phone            │                                          │
│  │ • Password         │                                          │
│  │ • Confirm Password │                                          │
│  └─────────┬──────────┘                                          │
│            │                                                     │
│            │ Validate form (client-side)                        │
│            ▼                                                     │
│  ┌─────────────────────────┐                                    │
│  │ POST /api/auth/register │                                    │
│  └────────────┬────────────┘                                    │
│               │                                                  │
│               │ Backend validation & hashing                    │
│               ▼                                                  │
│  ┌─────────────────────────────────────┐                        │
│  │ Create User in Database             │                        │
│  │ • Email unique check ✓              │                        │
│  │ • Hash password (bcryptjs, 10) ✓   │                        │
│  │ • Save to MongoDB ✓                 │                        │
│  └────────────┬────────────────────────┘                        │
│               │                                                  │
│               │ Auto-login with signIn()                        │
│               ▼                                                  │
│  ┌─────────────────────────────────────┐                        │
│  │ Create JWT Session                  │                        │
│  │ • User ID in token                  │                        │
│  │ • Set HTTP-only cookie              │                        │
│  │ • CSRF protection enabled           │                        │
│  └────────────┬────────────────────────┘                        │
│               │                                                  │
│               │ Redirect to home                                │
│               ▼                                                  │
│  ┌───────────────────────┐                                      │
│  │ Home Page (Protected) │ ✅ Success                           │
│  │ • User greeting       │                                      │
│  │ • User menu visible   │                                      │
│  └───────────────────────┘                                      │
│                                                                   │
│  ───────────────────────────────────────────────────────────    │
│                                                                   │
│  2. User Logs In                                                │
│  ┌────────────────────┐                                          │
│  │ Login Page         │                                          │
│  │ • Email            │                                          │
│  │ • Password         │                                          │
│  └─────────┬──────────┘                                          │
│            │                                                     │
│            │ Validate form (client-side)                        │
│            ▼                                                     │
│  ┌──────────────────────────────────┐                           │
│  │ signIn('credentials', {           │                           │
│  │   email,                          │                           │
│  │   password                        │                           │
│  │ })                                │                           │
│  └────────────┬─────────────────────┘                           │
│               │                                                  │
│               │ NextAuth Credentials Provider                   │
│               ▼                                                  │
│  ┌──────────────────────────────────────┐                       │
│  │ Backend Validation                   │                       │
│  │ • Find user by email ✓              │                       │
│  │ • Compare password hash ✓           │                       │
│  │ • Return user data ✓                │                       │
│  └────────────┬───────────────────────┘                        │
│               │                                                  │
│               │ Create session                                  │
│               ▼                                                  │
│  ┌──────────────────────────┐                                  │
│  │ JWT Session Created       │                                  │
│  │ • Save in secure cookie   │                                  │
│  │ • Enable CSRF protection  │                                  │
│  └────────────┬─────────────┘                                  │
│               │                                                  │
│               │ Redirect to home                                │
│               ▼                                                  │
│  ┌───────────────────────┐                                      │
│  │ Home Page             │ ✅ Logged in                         │
│  │ • User greeting       │                                      │
│  │ • User menu visible   │                                      │
│  └───────────────────────┘                                      │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Google OAuth Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                   │
│  User clicks "Sign in/up with Google"                           │
│              │                                                   │
│              ▼                                                   │
│  ┌───────────────────────────────────┐                          │
│  │ NextAuth OAuth Flow               │                          │
│  │ → Redirect to Google auth URL     │                          │
│  └────────────┬──────────────────────┘                          │
│               │                                                  │
│               │ HTTPS → Google Login                            │
│               ▼                                                  │
│  ┌────────────────────────────────┐                             │
│  │ Google Consent Screen           │                            │
│  │ ┌────────────────────────────┐ │                             │
│  │ │ FoodHub wants to:          │ │                             │
│  │ │ • View your profile        │ │                             │
│  │ │ • View your email address  │ │                             │
│  │ │                            │ │                             │
│  │ │ [Allow]  [Cancel]          │ │                             │
│  │ └────────────────────────────┘ │                             │
│  └────────────┬───────────────────┘                             │
│               │                                                  │
│               │ (if Allow clicked)                              │
│               ▼                                                  │
│  ┌─────────────────────────────┐                                │
│  │ Google returns auth code    │                                │
│  │ → Redirect to callback URL  │                                │
│  └────────────┬────────────────┘                                │
│               │                                                  │
│               │ /api/auth/callback/google                       │
│               ▼                                                  │
│  ┌──────────────────────────────────────┐                       │
│  │ NextAuth Processes Google Profile    │                       │
│  │ • Exchange code for token ✓         │                       │
│  │ • Fetch user profile ✓              │                       │
│  │ • Get: name, email, image ✓         │                       │
│  └────────────┬───────────────────────┘                        │
│               │                                                  │
│               │ signIn callback                                 │
│               ▼                                                  │
│  ┌──────────────────────────────────────┐                       │
│  │ Check User in Database               │                       │
│  │ • Find by email (case-insensitive) ✓│                       │
│  │ • Exists? → Update avatar            │                       │
│  │ • New? → Create user account         │                       │
│  │ • Auto-verify email ✓                │                       │
│  └────────────┬───────────────────────┘                        │
│               │                                                  │
│               │ Create Session                                  │
│               ▼                                                  │
│  ┌──────────────────────────┐                                  │
│  │ JWT Session Created       │                                  │
│  │ • HTTP-only cookie        │                                  │
│  │ • CSRF token              │                                  │
│  │ • 30-day expiry           │                                  │
│  └────────────┬─────────────┘                                  │
│               │                                                  │
│               │ Redirect to home                                │
│               ▼                                                  │
│  ┌──────────────────────────────┐                               │
│  │ Home Page                     │ ✅ User logged in            │
│  │ • Profile picture visible     │    Google OAuth             │
│  │ • User menu with logout       │                              │
│  │ • Personalized greeting       │                              │
│  └──────────────────────────────┘                               │
│                                                                   │
│  ───────────────────────────────────────────────────────────    │
│                                                                   │
│  Database Record Created:                                       │
│  {                                                              │
│    _id: ObjectId,                                              │
│    email: "user@gmail.com",                                    │
│    fullName: "John Doe",                                       │
│    phone: "", (optional)                                       │
│    passwordHash: "oauth_...", (placeholder)                    │
│    avatar: "https://...", (from Google)                        │
│    isVerified: true, (auto from Google)                        │
│    createdAt: Date,                                            │
│    updatedAt: Date                                             │
│  }                                                              │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Protected Route Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                   │
│  Scenario 1: Access Protected Route WITHOUT Session            │
│                                                                   │
│  User tries: http://localhost:3000/(app)/home                   │
│              │                                                   │
│              ▼                                                   │
│  ┌───────────────────────────┐                                  │
│  │ Middleware checks session │                                  │
│  │ await auth()              │                                  │
│  └────────────┬──────────────┘                                  │
│               │                                                  │
│               ├─ Session found? NO ✗                            │
│               │                                                  │
│               ▼                                                  │
│  ┌────────────────────────────┐                                 │
│  │ Redirect to /auth/login    │                                 │
│  │ (middleware.ts line 16)    │                                 │
│  └────────────┬───────────────┘                                 │
│               │                                                  │
│               ▼                                                  │
│  ┌────────────────────┐                                          │
│  │ Login Page         │ ✅ Redirected                           │
│  │ • User must login  │    automatically                        │
│  └────────────────────┘                                          │
│                                                                   │
│  ───────────────────────────────────────────────────────────    │
│                                                                   │
│  Scenario 2: Access Protected Route WITH Session               │
│                                                                   │
│  User (logged in) visits: /(app)/home                           │
│              │                                                   │
│              ▼                                                   │
│  ┌───────────────────────────┐                                  │
│  │ Middleware checks session │                                  │
│  │ await auth()              │                                  │
│  └────────────┬──────────────┘                                  │
│               │                                                  │
│               ├─ Session found? YES ✓                           │
│               │                                                  │
│               ▼                                                  │
│  ┌──────────────────────────────┐                               │
│  │ Allow access to route        │                               │
│  │ Return NextResponse.next()   │                               │
│  └────────────┬─────────────────┘                               │
│               │                                                  │
│               ▼                                                  │
│  ┌─────────────────────────────┐                                │
│  │ Page loads with session     │ ✅ Full access                │
│  │ • useAuth() has user data   │    granted                    │
│  │ • User menu visible         │                                │
│  │ • Can access protected API  │                                │
│  └─────────────────────────────┘                                │
│                                                                   │
│  ───────────────────────────────────────────────────────────    │
│                                                                   │
│  Scenario 3: Access Auth Page WITH Session                     │
│                                                                   │
│  User (logged in) visits: /auth/login                           │
│              │                                                   │
│              ▼                                                  │
│  ┌───────────────────────────┐                                  │
│  │ Middleware checks session │                                  │
│  │ await auth()              │                                  │
│  └────────────┬──────────────┘                                  │
│               │                                                  │
│               ├─ Session found? YES ✓                           │
│               │  Auth page? YES ✓                               │
│               │                                                  │
│               ▼                                                  │
│  ┌──────────────────────────────┐                               │
│  │ Redirect to /(app)/home      │                               │
│  │ (middleware.ts line 23)      │                               │
│  └────────────┬─────────────────┘                               │
│               │                                                  │
│               ▼                                                  │
│  ┌──────────────────────────┐                                  │
│  │ Home Page               │ ✅ Redirected                     │
│  │ • User already logged   │    to home                        │
│  │ • No need to login      │                                    │
│  └──────────────────────────┘                                  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Session & Cookie Management

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                   │
│  Session Lifecycle                                              │
│                                                                   │
│  1. User Logs In                                                │
│  ┌──────────────┐                                                │
│  │ signIn() ✓   │                                                │
│  └───────┬──────┘                                                │
│          │                                                       │
│          ▼                                                       │
│  ┌──────────────────────────────┐                               │
│  │ NextAuth JWT Created         │                               │
│  │ Payload:                     │                               │
│  │ {                            │                               │
│  │   sub: "user_id",            │                               │
│  │   email: "user@email.com",   │                               │
│  │   iat: 1234567890,           │                               │
│  │   exp: 1234567890 + 30days   │                               │
│  │ }                            │                               │
│  └───────────┬──────────────────┘                               │
│              │                                                   │
│              ▼                                                   │
│  ┌───────────────────────────────┐                              │
│  │ Store in HTTP-only Cookie      │                              │
│  │ Cookie: next-auth.session-token│                              │
│  │ Secure: true (HTTPS only)      │                              │
│  │ HttpOnly: true (JS no access)  │                              │
│  │ SameSite: Lax (CSRF safe)      │                              │
│  │ Max-Age: 30 days               │                              │
│  └───────────┬────────────────────┘                              │
│              │                                                   │
│              ▼                                                   │
│  ┌──────────────────────────────┐                               │
│  │ Browser Storage              │                               │
│  │ LocalStorage: empty (secure) │                               │
│  │ SessionStorage: empty        │                               │
│  │ Cookies:                     │                               │
│  │ ├─ next-auth.session-token   │                               │
│  │ ├─ next-auth.csrf-token      │                               │
│  │ └─ next-auth.callback-url    │                               │
│  └──────────────────────────────┘                               │
│                                                                   │
│  ───────────────────────────────────────────────────────────    │
│                                                                   │
│  2. On Each Request                                             │
│  ┌──────────────────────────┐                                  │
│  │ Browser sends cookies    │                                  │
│  │ With every request ✓     │                                  │
│  └────────────┬─────────────┘                                  │
│               │                                                  │
│               ▼                                                  │
│  ┌──────────────────────────┐                                  │
│  │ NextAuth validates JWT   │                                  │
│  │ • Verify signature ✓     │                                  │
│  │ • Check expiration ✓     │                                  │
│  │ • Decode payload ✓       │                                  │
│  └────────────┬─────────────┘                                  │
│               │                                                  │
│               ▼                                                  │
│  ┌──────────────────────────────┐                               │
│  │ Session Callback (auth.ts)   │                               │
│  │ Add to NextAuth session:     │                               │
│  │ {                            │                               │
│  │   user: {                    │                               │
│  │     id: "...",               │                               │
│  │     email: "...",            │                               │
│  │     name: "...",             │                               │
│  │     image: "..."             │                               │
│  │   },                         │                               │
│  │   expires: "..."             │                               │
│  │ }                            │                               │
│  └────────────┬─────────────────┘                               │
│               │                                                  │
│               ▼                                                  │
│  ┌──────────────────────────────┐                               │
│  │ Available in Components      │                               │
│  │ useSession() → session       │                               │
│  │ useAuth() → user, session    │                               │
│  └──────────────────────────────┘                               │
│                                                                   │
│  ───────────────────────────────────────────────────────────    │
│                                                                   │
│  3. User Logs Out                                               │
│  ┌──────────────┐                                                │
│  │ signOut() ✓  │                                                │
│  └───────┬──────┘                                                │
│          │                                                       │
│          ▼                                                       │
│  ┌──────────────────────────────┐                               │
│  │ Delete Session Cookie        │                               │
│  │ Set Max-Age: 0               │                               │
│  │ Invalidate JWT               │                               │
│  └────────────┬─────────────────┘                               │
│               │                                                  │
│               ▼                                                  │
│  ┌──────────────────────────────┐                               │
│  │ Clear CSRF Token Cookie      │                               │
│  │ Clear other auth cookies     │                               │
│  └────────────┬─────────────────┘                               │
│               │                                                  │
│               ▼                                                  │
│  ┌──────────────────────────────┐                               │
│  │ Redirect to /auth/login      │                               │
│  │ Next requests → No session   │                               │
│  │ Access denied to protected   │                               │
│  │ routes                       │                               │
│  └──────────────────────────────┘                               │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Component Interaction Diagram

```
                    ┌──────────────────┐
                    │  Root Layout     │
                    │ (SessionProvider)│
                    └────────┬─────────┘
                             │
                ┌────────────┼────────────┐
                │            │            │
        ┌───────▼──┐  ┌──────▼──┐  ┌────▼──────┐
        │  Navbar  │  │  Home   │  │ Protected │
        │(UserMenu)│  │  Page   │  │  Routes   │
        └──────┬───┘  └──────┬──┘  └────┬──────┘
               │            │           │
               │ useAuth()  │           │
               │            │           │
        ┌──────▼──────────────▼──────────▼────┐
        │     auth.ts (NextAuth Config)       │
        │  ├─ Credentials Provider            │
        │  └─ Google OAuth Provider           │
        └──────────────┬─────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
    ┌───▼────┐   ┌────▼────┐   ┌────▼─────┐
    │MongoDB │   │  API    │   │ Cookies  │
    │ Users  │   │/Session │   │ (JWT)    │
    └────────┘   └─────────┘   └──────────┘
```

---

This architecture provides:
- ✅ Secure authentication
- ✅ Server-side session management
- ✅ Protected routes with middleware
- ✅ Flexible provider system
- ✅ Database persistence
- ✅ OAuth integration
- ✅ Error handling and validation
