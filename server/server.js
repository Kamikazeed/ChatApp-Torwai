import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import http from 'http';
import {Server} from 'socket.io';
import { connectDB } from './config/mongoDB.js';
import userRouter from './routes/userRoutes.js';
import msgRouter from './routes/msgRoutes.js';

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Initialize scoket.io server
export const io = new Server(server, {
  cors: {origin: '*'}
})

// Store online users
export const userSocketMap = {};

// Socket.io connection handler
io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;
  console.log('User Connected', userId);

  if(userId) userSocketMap[userId] = socket.id;
  io.emit('getOnlineUsers', Object.keys(userSocketMap));
  socket.on('disconnect', () => {
    console.log('User Disconnected', userId);
    delete userSocketMap[userId]
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
  })
})

// Middleware setup
app.use(express.json({limit: '4mb'}));
app.use(cors());

// Routes setup
app.use('/api/status', (req, res) => res.send('Serveris live'));
app.use('/api/auth', userRouter);
app.use('/api/messages', msgRouter);

// Connect to mongoDB
await connectDB()

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => console.log('Server is running on PORT:', PORT))
}


export default app