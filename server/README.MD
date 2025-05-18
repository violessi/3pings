# 🚲 Spin Reward Server

This is the backend server for the **Spin Reward** bike rental system. It is built with **Express.js**, communicates with a **Firebase Firestore** database, and is designed to serve requests from an **Expo React Native** client.

## 👨‍💻 Tech Stack

- **Node.js** + **Express.js** – HTTP server
- **Firebase Admin SDK** – Firestore database access
- **Expo React Native** – Frontend (client)
- **CORS** – Cross-origin support for the client

## 📁 Project Structure

```
src/
├── controllers/          # Route logic (per module)
│   ├── rentController.js
│   ├── reserveController.js
│   ├── rewardsController.js
│   ├── payController.js
│   └── returnController.js
├── routes/               # Route entrypoints
│   ├── rent.js
│   ├── reserve.js
│   ├── rewards.js
│   ├── pay.js
│   └── return.js
├── config/
│   └── firebaseAdmin.js  # Firebase admin SDK
└── server.js             # Express entrypoint
serviceAccountKey.json
```

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Add Firebase Admin SDK credentials

- Place your `serviceAccountKey.json` inside the root of the project or adjust the path in `firebaseAdmin.js`.

### 3. Start the server

```bash
npm start
```

Server will run at:

```
http://localhost:3000
```

## 🛰️ API Endpoints

| Method | Endpoint           | Description                |
| ------ | ------------------ | -------------------------- |
| GET    | `/`                | Welcome message            |
| POST   | `/api/rent/...`    | Bike rental endpoints      |
| POST   | `/api/reserve/...` | Bike reservation endpoints |
| POST   | `/api/rewards/...` | Reward system endpoints    |
| POST   | `/api/pay/...`     | Payment processing         |
| POST   | `/api/return/...`  | Bike return logic          |

## ⚠️ Error Handling

- **404 Not Found**: Unrecognized routes return a 404 JSON error.
- **500 Server Error**: Centralized error handler logs and returns a generic error response.

---

## 🧭 Environment Variables (Optional)

You can create a `.env` file to configure a custom port:

```
PORT=8080
```

## 📄 License

MIT License
