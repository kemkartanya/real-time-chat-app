import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import Message from './models/message.js';
import authRoute from './Routes/auth.js';
import messRoute from './Routes/message.js';
import userRoute from './Routes/user.js'

dotenv.config();

// MongoDB Atlas database connection
mongoose.connect(process.env.MONGODB_URL);
const db = mongoose.connection;

db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1); // Exit the process on connection error
});

db.once('open', () => {
  console.log('MongoDB database is connected');
});

// Middleware
const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({ origin: true }));

// Routes
app.use('/auth', authRoute); // Authentication: login & register
app.use('/mess', messRoute); // Message route
app.use('/users', userRoute);

// Start the server
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
  }, {
  connectionStateRecovery: (socket) => {
    return {
      serverOffset: socket.handshake.auth.serverOffset || 0
    };
  }
});

io.on('connection', (socket) => {
    console.log(socket);
    handleSocketConnection(socket);
})

function handleSocketConnection(socket) {
  socket.on('chat message', async (msg, username) => {
    try {
      const message = new Message({ content: msg, username: username });
      const savedMessage = await message.save();
      io.emit('chat message', savedMessage);
      // callback();
    } catch (e) {
      console.error(e);
      // callback(e);
    }
  });

  socket.on('private message', (data) => {
    const { to, message } = data;

    io.to(to).emit('private message', {
      from: socket.id,
      message,
    });
  });

  if (!socket.recovered) {
    console.log('recovered');
    handleSocketRecovery(socket);
  }
}

async function handleSocketRecovery(socket) {
  try {
    // const messages = await Message.find({ _id: { $gt: socket.handshake.auth.serverOffset || 0 } });
    const messages = await Message.find({});
    messages.forEach((message) => {
      console.log(message);
      socket.emit('chat message', message);
    });
  } catch (e) {
    console.error(e);
  }
}

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
