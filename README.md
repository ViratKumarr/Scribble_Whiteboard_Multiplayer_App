<p align="left"> © Virat Kumar 2025 | Built with ❤️ using MERN Stack + Socket.IO </p> <div align="center"> <h2>🖌️ Scribble.io - Real-time Collaborative Whiteboard</h2> <p> A modern, full-featured multiplayer whiteboard app that lets users draw, chat, and collaborate in real-time. </p> <img src="https://user-images.githubusercontent.com/your-screenshot-link" alt="Scribble Demo" width="100%"/> </div>
📋 Table of Contents
🧠 Introduction

⚙️ Tech Stack

🚀 Features

⚡ Getting Started

🌐 Deployment

📮 Contributing

📜 License

🙏 Acknowledgments

🧑‍💻 Creator

🧠 Introduction
Scribble.io is a real-time collaborative whiteboard built with the MERN stack, WebSockets (Socket.IO), and the HTML5 Canvas API. Whether you're brainstorming ideas, tutoring live, or sketching with friends—this platform gives you a clean, fast, and responsive space to create together.

Think Excalidraw meets Google Meet—without the complexity.

⚙️ Tech Stack
🖥️ Frontend
⚛️ React.js (with TypeScript)

🎨 HTML5 Canvas API

💬 Socket.IO Client

💅 Styled Components

🧭 React Router

🌐 Backend
🟩 Node.js

🚂 Express.js

🧠 Socket.IO

🗃️ MongoDB (Mongoose)

🔐 JWT Authentication

🚀 Features
✅ Real-time Collaboration — Draw together on a shared canvas using websockets.
✅ Multiple Tools — Pen, eraser, shapes, text input, and color picker with custom brush size.
✅ Room System — Invite others with room codes.
✅ User Auth — Secure login/register via JWT.
✅ Persistent Storage — Save/load canvas sessions from MongoDB.
✅ Live Chat — Communicate while drawing.
✅ Responsive UI — Works across mobile, tablet, and desktop.

⚡ Getting Started
✅ Prerequisites
Node.js (v14+)

npm or yarn

MongoDB (local or cloud)

📥 Clone & Install
bash
Copy
Edit
git clone https://github.com/ViratKumarr/Scribble_Whiteboard_Multiplayer_App.git
cd Scribble.io
bash
Copy
Edit
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
⚙️ Setup Environment
In the /server directory, create a .env file and add:

env
Copy
Edit
PORT=5000
MONGODB_URI=mongodb://localhost:27017/scribble
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
🚀 Run the App
bash
Copy
Edit
# Start backend
cd server
npm run dev

# Start frontend
cd ../client
npm start
Open your browser at 👉 http://localhost:3000

🌐 Deployment
🖼️ Frontend — Deploy to Vercel, Netlify, or GitHub Pages
🧠 Backend — Use Heroku, Railway, or a VPS
📦 Database — Deploy with MongoDB Atlas

📮 Contributing
We welcome contributions!

bash
Copy
Edit
# Step 1: Fork the repo
# Step 2: Create a new branch
git checkout -b feature/amazing-feature

# Step 3: Make changes, commit
git commit -m "Add new feature"

# Step 4: Push and create a PR
git push origin feature/amazing-feature
📜 License
Distributed under the MIT License. See LICENSE for more info.

🙏 Acknowledgments
Inspired by tools like Excalidraw, Miro, and Figma Whiteboard

Built using modern real-time collaboration techniques

🧑‍💻 Creator
Virat Kumarr
🔗 GitHub | 🌐 Portfolio | 💼 LinkedIn

Made with ❤️ and WebSockets by Virat Kumar
