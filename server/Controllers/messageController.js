import asyncHandler from "express-async-handler";
import Chat from "../models/chat.js";
import User from "../models/user.js";
import Message from "../models/message.js";

//@description     Get all Messages
//@route           GET /api/Message/:chatId
//@access          Protected
const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Create New Message
//@route           POST /api/Message/
//@access          Protected
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  try {
    // Create a new message
    const newMessage = {
      sender: req.user._id,
      content: content,
      chat: chatId,
    };

    let message = await Message.create(newMessage);

    // Populate sender field
    message = await message.populate("sender", "name pic");

    // Populate chat field
    message = await message.populate("chat");

    // Populate users in the chat
    const populatedMessage = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    // Update the latest message in the chat
    await Chat.findByIdAndUpdate(chatId, { latestMessage: populatedMessage });

    res.json(populatedMessage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export { allMessages, sendMessage };