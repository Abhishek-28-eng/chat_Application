const getDatabaseConnection = require("../config/db");

exports.sendImageMessage = async (req, res) => {
  try {
    const { sender_id, chatroom_id, message_text, college_db } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded." });
    }

    if (!chatroom_id || !sender_id || !college_db) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const db = getDatabaseConnection(college_db);
    const imageUrl = `http://195.35.45.44:8001/images/${req.file.filename}`;
    const text = message_text && message_text.trim() !== "" ? message_text : null;

    const sql = `
      INSERT INTO messages (chatroom_id, sender_id, message_image, message_text, timestamp)
      VALUES (?, ?, ?, ?, NOW())
    `;

    const [result] = await db.execute(sql, [chatroom_id, sender_id, imageUrl, text]);

    const messageData = {
      id: result.insertId,
      sender_id,
      chatroom_id,
      message_image: imageUrl,
      message_text: text,
      timestamp: new Date()
    };

    // 🔹 Emit to all users in the chatroom (if req.io is available)
    if (req.io) {
      req.io.to(chatroom_id).emit("new_message", messageData);
    }

    res.status(200).json({ message: "Image sent successfully", data: messageData });
  } catch (error) {
    console.error("Error sending image message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
