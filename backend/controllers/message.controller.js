// /controllers/message.controller.js
const getDatabaseConnection = require("../config/db");

// Save a message to the database
exports.saveMessage = async (req, res) => {
  const { chatroom_id, sender_id, message_text,timeStamp } = req.body;
  const db = getDatabaseConnection(req.params.college_db);

  try {
    // Insert message into the database
    const [result] = await db.execute(
      `INSERT INTO messages (chatroom_id, sender_id, message_text, timestamp, message_image) 
       VALUES (?, ?, ?, ?, ?)`, 
      [chatroom_id, sender_id, message_text,timeStamp, message_image]
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
      `SELECT 
    m.sender_id,
    CASE 
        WHEN m.sender_id LIKE 'S%' THEN s.Name
        WHEN m.sender_id LIKE 'T%' THEN t.tname
        ELSE NULL
    END AS sender_name,
    m.message_text,
    m.message_image,
    m.timestamp
FROM messages m
LEFT JOIN Student s ON m.sender_id = s.studentid
LEFT JOIN teacher t ON m.sender_id = t.teacher_code
WHERE m.chatroom_id = ?
ORDER BY m.timestamp ASC;
`, 
      [chatroom_id]
    );

    res.json({ messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching chat history' });
  }
};
