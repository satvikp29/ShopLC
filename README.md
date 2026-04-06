# ShopLC — Full-Stack E-Commerce Platform

A production-ready MERN stack e-commerce platform with authentication, payments, and an admin dashboard.

## Tech Stack

**Frontend:** React 18, Redux Toolkit, React Router v6, Axios
**Backend:** Node.js, Express.js, MongoDB, Mongoose
**Auth:** JWT, Passport.js (Google OAuth 2.0)
**Payments:** Stripe, Razorpay
**Security:** Helmet, express-rate-limit, bcryptjs, CORS

## Features

- **Authentication** — JWT login/register, Google OAuth, password reset
- **Product Catalog** — Full-text search, filter by category/price/rating, pagination, sorting
- **Product Detail** — Image gallery, specifications, reviews & star ratings
- **Shopping Cart** — Persisted in localStorage, quantity controls
- **Checkout** — Multi-step (Shipping → Payment → Review), Stripe, Razorpay, Cash on Delivery
- **Orders** — Order tracking, status timeline, cancel orders
- **User Profile** — Update info, manage multiple addresses, wishlist
- **Admin Dashboard** — Manage products (CRUD), manage orders (status updates), view stats

## Project Structure

```
ShopLC/
├── client/                  # React frontend (CRA)
│   └── src/
│       ├── components/      # Navbar, Footer, ProductCard, CartItem, etc.
│       ├── pages/           # Home, Products, Cart, Checkout, Orders, Admin...
│       ├── redux/           # Store + slices (auth, cart, products, orders)
│       └── utils/           # Axios API instance, helpers
└── server/                  # Node/Express backend
    ├── config/              # DB connection, Passport OAuth
    ├── controllers/         # auth, product, order, payment, user
    ├── middleware/          # JWT auth, error handler
    ├── models/              # User, Product, Order (Mongoose)
    └── routes/              # All API routes
```

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/shoplc.git
cd ShopLC
npm run install-all
```

### 2. Configure Environment

```bash
cp server/.env.example server/.env
# Edit server/.env with your credentials
```

### 3. Start Development Servers

```bash
npm run dev
# Starts backend on :5000 and frontend on :3000 concurrently
```

## Environment Variables

Copy `server/.env.example` to `server/.env` and fill in:

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `RAZORPAY_KEY_ID` | Razorpay key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay key secret |

## API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/google` | Google OAuth | Public |
| GET | `/api/products` | Get products (filter/sort/paginate) | Public |
| GET | `/api/products/:id` | Get single product | Public |
| POST | `/api/products` | Create product | Admin |
| PUT | `/api/products/:id` | Update product | Admin |
| POST | `/api/products/:id/reviews` | Add review | User |
| POST | `/api/orders` | Create order | User |
| GET | `/api/orders/myorders` | Get user's orders | User |
| PUT | `/api/orders/:id/pay` | Mark as paid | User |
| GET | `/api/orders` | Get all orders | Admin |
| PUT | `/api/orders/:id/status` | Update order status | Admin |
| POST | `/api/payments/stripe/create-intent` | Stripe payment intent | User |
| POST | `/api/payments/razorpay/create-order` | Create Razorpay order | User |
| POST | `/api/payments/razorpay/verify` | Verify Razorpay payment | User |

## Deployment

### Backend (e.g. Render, Railway)
```bash
npm start
```
Set `NODE_ENV=production` and all required env variables.

### Frontend (e.g. Vercel, Netlify)
```bash
npm run build --prefix client
```
Set `REACT_APP_API_URL` to your backend URL.

## License

MIT
