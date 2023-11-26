import express from 'express';
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import userRoutes from "./Routes/user.js";
import chatRoutes from "./Routes/chat.js";
import messageRoutes from "./Routes/message.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();

try {
  const conn = await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
  });

  console.log(`MongoDB Connected: ${conn.connection.host}`)
} catch (error) {
  console.log(`Error: ${error.message}`);
  process.exit();
}

const app = express();
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

app.get('/', (req, res) => {
  res.send("API is running");
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`))