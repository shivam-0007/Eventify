# 🎟️ Eventify

**Eventify** is a full-stack event booking platform where users can browse events, request bookings with OTP-verified confirmation, and manage their tickets — while admins can create events and manually approve or reject booking requests from a dedicated dashboard.

🔗 **Live Demo:** [https://eventify-client-bk48.onrender.com](https://eventify-client-bk48.onrender.com)

> Note: The backend is hosted on Render's free tier, so the first request after inactivity may take 30–60 seconds while the server spins back up.

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running Locally](#running-locally)
  - [Seeding the Database](#seeding-the-database)
- [API Overview](#-api-overview)
- [Authentication Flow](#-authentication-flow)
- [Booking Flow](#-booking-flow)
- [Deployment](#-deployment)
- [Known Limitations](#-known-limitations)
- [Roadmap](#-roadmap)
- [License](#-license)

---

## ✨ Features

**For Users**
- Register and sign in with JWT-based authentication
- Email OTP verification for new accounts
- Browse and search events by category
- Request event bookings, confirmed via a one-time email OTP
- View booking history and cancel pending/confirmed requests

**For Admins**
- Create, edit, and delete events
- Dashboard with revenue, paid clients, and pending request stats
- Manually approve bookings as *Paid* or *Undecided*, or reject them
- Automatic seat availability tracking on confirmation/cancellation

---

## 🛠 Tech Stack

| Layer      | Technology                                      |
|------------|--------------------------------------------------|
| Frontend   | React (Vite), React Router, Tailwind CSS, Axios  |
| Backend    | Node.js, Express 5                               |
| Database   | MongoDB with Mongoose                            |
| Auth       | JWT, bcryptjs                                    |
| Email      | Nodemailer (SMTP)                                |
| Hosting    | Render (Static Site + Web Service)               |

---

## 📁 Project Structure

```
Eventify/
├── client/                # React (Vite) frontend
│   └── src/
│       ├── components/    # Shared UI components (Navbar, etc.)
│       ├── context/       # AuthContext for global auth state
│       ├── pages/         # Route-level pages (Home, Login, Register, Dashboards, etc.)
│       └── utils/         # Axios instance and helpers
│
├── server/                # Express backend
│   ├── controllers/       # Route handlers (auth, bookings, events)
│   ├── middleware/        # JWT auth & admin guards
│   ├── models/            # Mongoose schemas (User, Event, Booking, OTP)
│   ├── routes/            # Express routers
│   ├── utils/             # Email sending helpers
│   ├── seed.js            # Database seeding script
│   └── index.js           # Server entry point
│
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- A MongoDB database (local instance or [MongoDB Atlas](https://www.mongodb.com/atlas))
- A Gmail account with an [App Password](https://myaccount.google.com/apppasswords) for sending OTP emails

### Installation

Clone the repository and install dependencies for both the client and server:

```bash
git clone https://github.com/shivam-0007/Eventify.git
cd Eventify

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Environment Variables

Create a `.env` file inside the `server/` directory with the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
PORT=5001
```

Create a `.env` file inside the `client/` directory:

```env
VITE_API_URL=http://localhost:5001/api
```

> **Note:** Never commit your `.env` files. Both are already covered by `.gitignore`.

### Running Locally

**Start the backend** (from `server/`):
```bash
npm run dev
```

**Start the frontend** (from `client/`, in a separate terminal):
```bash
npm run dev
```

The client will be available at `http://localhost:5173`, and the API at `http://localhost:5001`.

### Seeding the Database

To populate your database with demo users, events, and randomized bookings:

```bash
cd server
node seed.js
```

This creates:
- **Admin login:** `admin@eventora.com` / `password123`
- **User login:** `user@eventora.com` / `password123`
- A set of sample events and randomized booking requests

---

## 🔌 API Overview

| Method | Endpoint                          | Description                          | Auth Required |
|--------|------------------------------------|---------------------------------------|----------------|
| POST   | `/api/auth/register`              | Register a new user                   | ❌             |
| POST   | `/api/auth/login`                 | Log in                                | ❌             |
| POST   | `/api/auth/verify-otp`            | Verify account via OTP                | ❌             |
| GET    | `/api/events`                     | List all events                       | ❌             |
| GET    | `/api/events/:id`                 | Get a single event                    | ❌             |
| POST   | `/api/events`                     | Create an event                       | ✅ Admin       |
| PUT    | `/api/events/:id`                 | Update an event                       | ✅ Admin       |
| DELETE | `/api/events/:id`                 | Delete an event                       | ✅ Admin       |
| POST   | `/api/bookings/send-otp`          | Send OTP for booking confirmation     | ✅ User        |
| POST   | `/api/bookings`                   | Request a booking (with OTP)          | ✅ User        |
| GET    | `/api/bookings/my`                | Get current user's (or all) bookings  | ✅ User        |
| PUT    | `/api/bookings/:id/confirm`       | Confirm a booking                     | ✅ Admin       |
| DELETE | `/api/bookings/:id`                | Cancel/reject a booking               | ✅ User/Admin  |

---

## 🔐 Authentication Flow

1. User registers with name, email, and password.
2. A 6-digit OTP is generated and emailed to the user; the account is created with `isVerified: false`.
3. If the user tries to log in before verifying, a fresh OTP is issued automatically.
4. Submitting the correct OTP marks the account as verified and returns a JWT.
5. The JWT is stored client-side and attached to subsequent requests via an Axios interceptor.

---

## 🎫 Booking Flow

1. A logged-in user requests an OTP for booking a specific event.
2. The OTP is emailed and must be submitted alongside the booking request.
3. On successful verification, a `Booking` is created with `status: pending`.
4. An admin reviews pending requests on the dashboard and either:
   - **Approves as Paid** — marks the booking confirmed and payment status `paid`
   - **Approves Undecided** — confirms the booking without marking payment
   - **Rejects** — cancels the request
5. Confirming a booking decrements the event's available seat count; cancelling a previously confirmed booking restores it.

---

## ☁️ Deployment

This project is deployed on **Render** as two separate services:

- **Backend** — Web Service, root directory `server`, build command `npm install`, start command `node index.js`
- **Frontend** — Static Site, root directory `client`, build command `npm install && npm run build`, publish directory `dist`

Environment variables (`MONGODB_URI`, `JWT_SECRET`, `EMAIL_USER`, `EMAIL_PASS` for the backend; `VITE_API_URL` for the frontend) are configured directly in each service's Render dashboard.

---

## ⚠️ Known Limitations

- **Outbound SMTP on Render's free tier:** Render blocks standard SMTP ports on free-tier services, which can prevent OTP/booking emails from sending in production via Nodemailer + Gmail. A transactional email API (e.g., Resend, SendGrid) is recommended as a production-ready alternative to SMTP.
- **Free-tier cold starts:** Backend services on Render's free tier spin down after periods of inactivity, causing a delay (and occasionally a failed first request) on the next visit.

---

## 🗺 Roadmap

- [ ] Migrate email delivery to a transactional email API
- [ ] Add payment gateway integration (currently manual admin confirmation)
- [ ] Add pagination and filtering to the events list
- [ ] Add automated tests for booking and auth flows

---

## 📄 License

This project is licensed under the ISC License.
