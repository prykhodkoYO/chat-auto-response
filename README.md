# Chat Auto Response App

A full-stack chat application with automatic responses built with React and Express.js.

## 🚀 Features

- Real-time chat interface with automatic responses
- Google OAuth authentication
- User profiles and chat management
- TypeScript support

## 🛠️ Tech Stack

- **Frontend:** React 19 + TypeScript
- **Backend:** Node.js + Express + TypeScript
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT + Google OAuth

## 📁 Project Structure

```
chat-auto-response/
├── client/              # React frontend application
│   ├── src/
│   ├── package.json
│   └── .env.example
├── server/              # Express backend application  
│   ├── src/
│   ├── package.json
│   └── .env.example
├── README.md
└── render.yaml          # Backend deployment config
```

## 🔧 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB database

### Local Development

1. **Setup backend:**
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Edit .env with your MongoDB URI and secrets
   npm run dev
   ```

2. **Setup frontend (in a new terminal):**
   ```bash
   cd client
   npm install
   cp .env.example .env.local
   # Edit .env.local with your backend API URL
   npm start
   ```

**Running at:** Frontend (http://localhost:3000) | Backend (http://localhost:5000)

## 📋 Environment Variables

**Backend (.env):**
```
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
GOOGLE_CLIENT_ID=your-google-client-id
```

**Frontend (.env.local):**
```
REACT_APP_API_URL=your-backend-api-url
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
```