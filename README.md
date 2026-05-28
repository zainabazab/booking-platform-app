# Booking Platform (React + Node.js/Express/MongoDB)

## 🎯 Project Goal
A full-stack application enabling users to register, view available services, and book specific time slots, with robust logic to prevent double bookings.

## 🛠️ Tech Stack
- **Frontend:** React, React Router, Axios
- **Backend:** Node.js, Express
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JWT (JSON Web Tokens), bcryptjs

## ⚙️ How to Run Locally

## Backend Setup
1. Navigate to the `booking-platform-backend` directory.
2. Install dependencies: `npm install`
3. Create a `.env` file and populate it:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string_here
   JWT_SECRET=a_secure_random_key
