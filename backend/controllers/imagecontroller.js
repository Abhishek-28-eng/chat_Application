const getDatabaseConnection = require("../config/db");

exports.sendImageMessage = async (req, res) => {
  try {
    const { sender_id, chatroom_id } = req.body;
    const college_db = req.params.college_db;

    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded." });
    }

    const db = getDatabaseConnection(college_db);

    const imageUrl = `http://195.35.45.44:8001/images/${req.file.filename}`;

    const sql = `
      INSERT INTO messages (chatroom_id, sender_id, message_text, timestamp)
      VALUES (?, ?, ?, NOW())
    `;

    const [result] = await db.execute(sql, [chatroom_id, sender_id, imageUrl]);

    res.status(200).json({ message: "Image sent successfully", imageUrl });
  } catch (error) {
    console.error("Error sending image message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
