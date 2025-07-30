<p align="left">
  © Virat Kumar 2025 | Built with ❤️ using MERN Stack + Socket.IO
</p>

<div align="center">
  <h2>🖌️ Scribble.io - Real-time Collaborative Whiteboard</h2>
  <p>
    A modern, full-featured multiplayer whiteboard app that lets users draw, chat, and collaborate in real-time.
  </p>
  <img src="https://your-image-link-here.png" alt="Scribble Whiteboard Demo" width="100%" />
</div>

---

## 📋 Table of Contents

1. [🧠 Introduction](#introduction)
2. [⚙️ Tech Stack](#tech-stack)
3. [🚀 Features](#features)
4. [⚡ Getting Started](#getting-started)
5. [🌐 Deployment](#deployment)
6. [📮 Contributing](#contributing)
7. [📜 License](#license)
8. [🙏 Acknowledgments](#acknowledgments)
9. [🧑‍💻 Creator](#creator)

---

## 🧠 Introduction

**Scribble.io** is a real-time collaborative whiteboard built using the MERN stack, WebSockets (Socket.IO), and the HTML5 Canvas API.  
Whether you're sketching ideas, conducting remote tutorials, or brainstorming with your team — this app makes real-time visual collaboration effortless.

> Think Excalidraw meets Google Meet—without the complexity.

---

## ⚙️ Tech Stack

### 🖥️ Frontend

- ⚛️ React.js (with TypeScript)
- 🎨 HTML5 Canvas API
- 💬 Socket.IO Client
- 💅 Styled Components
- 🧭 React Router

### 🌐 Backend

- 🟩 Node.js
- 🚂 Express.js
- 🧠 Socket.IO
- 🗃️ MongoDB (Mongoose)
- 🔐 JWT Authentication

---

## 🚀 Features

✅ **Real-time Collaborative Drawing**  
✅ **Multiple Drawing Tools** (pen, eraser, shapes, text)  
✅ **Custom Color Picker & Brush Size**  
✅ **Room-based Collaboration with User Auth**  
✅ **Live Chat Integration**  
✅ **Canvas Save/Load from Database**  
✅ **Fully Responsive Design**

---

## ⚡ Getting Started

### ✅ Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or cloud)

### 📥 Clone & Install

```bash
git clone https://github.com/ViratKumarr/Scribble_Whiteboard_Multiplayer_App.git
cd Scribble.io
```

# Server setup
cd server
npm install

# Client setup
cd ../client
npm install

## ⚙️ Environment Variables
Create a .env file in the server/ directory:

PORT=5000
MONGODB_URI=mongodb://localhost:27017/scribble
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000

## 🚀 Run the App
# Start backend
cd server
npm run dev

# Start frontend
cd ../client
npm start

Open 👉 http://localhost:3000 in your browser.

## 🌐 Deployment

Frontend → Vercel, Netlify, GitHub Pages

Backend → Heroku, Railway, Render

Database → MongoDB Atlas

## 📁 Project Structure
scribble.io/
├── client/                 # Frontend React app
│   ├── public/
│   └── src/
│       ├── components/
│       ├── contexts/
│       ├── hooks/
│       ├── pages/
│       ├── services/
│       ├── styles/
│       ├── types/
│       └── utils/
├── server/                 # Backend Node.js app
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── utils/
└── shared/                 # Shared code
    └── types/

## 📜 License
Distributed under the MIT License.
See LICENSE for full license info.

## 🙏 Acknowledgments
Inspired by Excalidraw, Miro, and real-time multiplayer tools

Built using modern web technologies focused on speed, collaboration, and usability

## 🧑‍💻 Creator
Virat Kumarr
🔗 GitHub
🌐 Portfolio
💼 LinkedIn

Made with ❤️ using React, Node.js & Socket.IO by Virat Kumar








