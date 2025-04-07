// /controllers/message.controller.js
const getDatabaseConnection = require("../config/db");

// Save a message to the database
exports.saveMessage = async (req, res) => {
  const { chatroom_id, sender_id, message_text } = req.body;
  const db = getDatabaseConnection(req.params.college_db);

  try {
    // Insert message into the database
    const [result] = await db.execute(
      `INSERT INTO messages (chatroom_id, sender_id, message_text) 
       VALUES (?, ?, ?)`, 
      [chatroom_id, sender_id, message_text]
    );
    res.status(200).json({ message: 'Message saved successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving message' });
  }
};

// Fetch chat history from the database
exports.getChatHistory = async (req, res) => {
  const { chatroom_id } = req.params;
  const db = getDatabaseConnection(req.params.college_db);

  try {
    // Fetch all messages in the chatroom
    const [messages] = await db.execute(
      `SELECT sender_id, message_text, timestamp 
       FROM messages 
       WHERE chatroom_id = ? 
       ORDER BY timestamp ASC`, 
      [chatroom_id]
    );

    res.json({ messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching chat history' });
  }
};
