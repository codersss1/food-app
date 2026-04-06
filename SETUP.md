# FoodHub LPU - MERN Stack Setup Guide

This is a complete food delivery application built with the MERN stack (MongoDB, Express, React, Node.js).

## Project Structure

```
├── backend/          # Node.js + Express backend
│   ├── models/       # MongoDB schemas
│   ├── controllers/  # API logic
│   ├── routes/       # API endpoints
│   ├── middleware/   # Custom middleware (auth, upload, error handling)
│   ├── config/       # Configuration files
│   ├── utils/        # Helper functions
│   └── server.js     # Main server file
├── frontend/         # React + Vite frontend (Next.js migration)
│   ├── app/          # Next.js App Router
│   ├── components/   # React components
│   ├── lib/          # Utilities and API client
│   ├── public/       # Static assets
│   └── src/          # Source files
└── package.json      # Root project config
```

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or pnpm package manager
- Razorpay account (for payment processing)

## Backend Setup

### 1. Environment Configuration

```bash
cd backend
cp .env.example .env
```

Update `.env` with your values:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/foodhub
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/foodhub

# JWT
JWT_SECRET=your_secret_key_here_min_32_chars
JWT_EXPIRY=7d

# Email Service (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### 2. Install Dependencies

```bash
cd backend
npm install
```

### 3. Start MongoDB

**Local MongoDB:**
```bash
mongod
```

**MongoDB Atlas:** Ensure your cluster is running and connection string is in `.env`

### 4. Start Backend Server

```bash
npm run dev
```

Server will run on `http://localhost:5000`

## Frontend Setup

### 1. Environment Configuration

```bash
cd frontend
cp .env.local.example .env.local
```

Update `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### 2. Install Dependencies

```bash
cd frontend
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify-email` - Verify email with OTP
- `POST /api/auth/resend-otp` - Resend OTP

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/password` - Change password

### Restaurants
- `GET /api/restaurants` - Get all restaurants with filters
- `GET /api/restaurants/:id` - Get restaurant details
- `GET /api/restaurants/:id/menu` - Get restaurant menu

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order details
- `POST /api/orders/:id/cancel` - Cancel order
- `PUT /api/orders/:id/delivery-address` - Update delivery address

### Payments
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify` - Verify payment

### Reviews
- `POST /api/reviews` - Submit review
- `GET /api/reviews/restaurant/:id` - Get restaurant reviews

## Features Implemented

### Authentication
- User registration with email verification
- Login/Logout functionality
- JWT-based authentication
- Password hashing with bcrypt
- OTP-based email verification

### Restaurants & Menu
- Browse restaurants with filtering
- View detailed restaurant info
- Browse menu items by category
- Search restaurants by name or cuisine

### Shopping Cart
- Add items to cart
- View cart items
- Update quantities
- Remove items
- Cart persistence

### Checkout & Orders
- Delivery address management
- Order summary and total calculation
- Apply promo codes
- Order placement
- Order history and tracking

### Payments
- Razorpay integration
- Secure payment processing
- Order confirmation after payment

### User Profile
- View and edit profile information
- View order history
- Change password
- Logout

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  phone: String,
  password: String (hashed),
  avatar: String (optional),
  isEmailVerified: Boolean,
  role: String ('student', 'admin'),
  createdAt: Date,
  updatedAt: Date
}
```

### Restaurants Collection
```javascript
{
  _id: ObjectId,
  name: String,
  cuisine: [String],
  description: String,
  image: String,
  rating: Number,
  deliveryTime: Number,
  deliveryFee: Number,
  minOrder: Number,
  isActive: Boolean,
  createdAt: Date
}
```

### Orders Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  restaurantId: ObjectId (ref: Restaurant),
  items: [{
    menuItemId: ObjectId,
    name: String,
    price: Number,
    quantity: Number
  }],
  status: String ('pending', 'confirmed', 'delivered', 'cancelled'),
  totalAmount: Number,
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  paymentStatus: String ('pending', 'completed', 'failed'),
  promoCode: String (optional),
  specialInstructions: String (optional),
  createdAt: Date
}
```

## Troubleshooting

### Backend Won't Start
- Check if MongoDB is running
- Verify `.env` file has correct values
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`

### API Requests Failing
- Ensure backend is running on port 5000
- Check `NEXT_PUBLIC_API_URL` in frontend `.env.local`
- Verify CORS is properly configured

### Email Verification Not Working
- Check Gmail app password (not regular password)
- Enable "Less secure app access" if using Gmail
- Use an email service like SendGrid or Mailgun

### Payment Integration Issues
- Verify Razorpay keys in backend `.env`
- Test with Razorpay test keys first
- Check Razorpay console for transaction logs

## Development Tips

### Running Both Servers

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

### Database Management

**MongoDB Compass** - GUI for MongoDB
```bash
# Download from: https://www.mongodb.com/products/compass
```

**Mongosh CLI** - MongoDB command line
```bash
mongosh
use foodhub
db.users.find()
```

### Testing APIs

Use Postman or Thunder Client to test API endpoints:

1. Create environment with variables:
   - `base_url` = `http://localhost:5000/api`
   - `token` = JWT token from login response

2. In requests, use `{{base_url}}/endpoint`

## Deployment

### Backend (Heroku, Railway, or Render)

1. Set environment variables on hosting platform
2. Ensure MongoDB is cloud-based (MongoDB Atlas)
3. Update `FRONTEND_URL` to your deployed frontend

### Frontend (Vercel, Netlify)

1. Set `NEXT_PUBLIC_API_URL` to your backend URL
2. Build and deploy

## Support

For issues or questions, check:
- Backend logs in terminal
- Browser console for frontend errors
- Network tab in DevTools for API calls
- MongoDB logs in `mongod` terminal

## License

This project is part of the LPU FoodHub initiative.
