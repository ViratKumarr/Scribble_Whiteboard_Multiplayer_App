# Scribble.io - Collaborative Whiteboard Application

Scribble.io is a real-time collaborative whiteboard application that allows multiple users to draw and interact simultaneously on a shared canvas.

## Features

- Real-time collaborative drawing
- Multiple drawing tools (pen, eraser, shapes, text)
- Color picker and brush size options
- User authentication and authorization
- Persistent canvas saving and loading
- Room-based collaboration
- Chat functionality
- Responsive design

## Tech Stack

### Frontend
- React.js with TypeScript
- HTML5 Canvas API
- Socket.IO Client
- Styled Components
- React Router

### Backend
- Node.js
- Express.js
- Socket.IO
- MongoDB (for storing users and saved canvases)
- JWT for authentication

## Project Structure

```
scribble.io/
├── client/                 # Frontend React application
│   ├── public/             # Static files
│   └── src/                # React source code
│       ├── components/     # UI components
│       ├── contexts/       # React contexts
│       ├── hooks/          # Custom React hooks
│       ├── pages/          # Page components
│       ├── services/       # API services
│       ├── styles/         # Global styles
│       ├── types/          # TypeScript type definitions
│       └── utils/          # Utility functions
├── server/                 # Backend Node.js application
│   ├── config/             # Configuration files
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Express middleware
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   └── utils/              # Utility functions
└── shared/                 # Shared code between client and server
    └── types/              # Shared TypeScript types
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/scribble.io.git
   cd scribble.io
   ```

2. Install dependencies for both client and server
   ```bash
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

3. Set up environment variables
   - Create a `.env` file in the server directory
   - Add the following variables:
     ```
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/scribble
     JWT_SECRET=your_jwt_secret
     CLIENT_URL=http://localhost:3000
     ```

4. Start the development servers
   ```bash
   # Start the server (from the server directory)
   npm run dev
   
   # Start the client (from the client directory)
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Deployment

The application can be deployed to various platforms:

- Frontend: Vercel, Netlify, or GitHub Pages
- Backend: Heroku, Railway, or any VPS
- Database: MongoDB Atlas

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by collaborative drawing applications like Excalidraw and Miro
- Built with modern web technologies for real-time collaboration

## Creator

- **Virat Kumarr** - [GitHub](https://github.com/ViratKumarr) | [Portfolio](https://virat-portfolio-personal.vercel.app/)