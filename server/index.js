import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';
import { availableParallelism } from 'node:os';
import cluster from 'node:cluster';
import { createAdapter, setupPrimary } from '@socket.io/cluster-adapter';
import axios from 'axios'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import authRoute from './Routes/auth.js'  // login & register 

// Set up Global configuration access
dotenv.config()

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

const corsOptions = {
  origin:true
};

// MongoDB Atlas database connection
try {
  mongoose.connect(process.env.MONGODB_URL);
  console.log('MongoDB database is connected')
} catch(err) {
  console.log('MongoDB database connection failed')
}

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use('/auth', authRoute);  //authentication login registern

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Define a GET route
app.get('/', (req, res) => {
  res.send('Api is working, namaste world')
});

// if (cluster.isPrimary) {
//   const numCPUs = availableParallelism();
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork({
//       PORT: 3000 + i
//     });
//   }

//   setupPrimary();
// } else {
//   // connecting to database
//   try {
//     mongoose.connect(process.env.MONGO_URL, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     console.log('MongoDB database is connected')
//   } catch(err) {
//     console.log('MongoDB database connection failed')
//   }

//   const app = express();
//   const server = createServer(app);
//   const io = new Server(server, {
//     connectionStateRecovery: {},
//     adapter: createAdapter()
//   });

//   const __dirname = dirname(fileURLToPath(import.meta.url));

//   app.get('/', (req, res) => {
//     res.sendFile(join(__dirname, 'index.html'));
//   });

//   io.on('connection', async (socket) => {
//     socket.on('chat message', async (msg, clientOffset, callback) => {
//       let result;
//       try {
//         result = await db.run('INSERT INTO messages (content, client_offset) VALUES (?, ?)', msg, clientOffset);
//       } catch (e) {
//         if (e.errno === 19 /* SQLITE_CONSTRAINT */ ) {
//           callback();
//         } else {
//           // nothing to do, just let the client retry
//         }
//         return;
//       }
//       io.emit('chat message', msg, result.lastID);
//       callback();
//     });

//     if (!socket.recovered) {
//       try {
//         await db.each('SELECT id, content FROM messages WHERE id > ?',
//           [socket.handshake.auth.serverOffset || 0],
//           (_err, row) => {
//             socket.emit('chat message', row.content, row.id);
//           }
//         )
//       } catch (e) {
//         // something went wrong
//       }
//     }
//   });

//   const port = process.env.PORT;

//   server.listen(port, () => {
//     console.log(`server running at http://localhost:${port}`);
//   });
// }


