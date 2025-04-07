// // /controllers/studentController.js
// const getDatabaseConnection = require("../config/db");

// // Controller to get chatroom_id based on standard and division
// exports.getChatroomId = async (req, res) => {
//   const { college_db } = req.params;
//   const { standard, division } = req.body;

//   try {
//     const db = getDatabaseConnection(college_db);

//     const [rows] = await db.execute(
//       `SELECT id FROM chat_rooms WHERE standard = ? AND division = ?`,
//       [standard, division]
//     );

//     if (rows.length === 0) {
//       return res.status(404).json({ message: "Chatroom not found" });
//     }

//     const id = rows[0].id;
//     res.status(200).json({ id });
//   } catch (error) {
//     console.error("Error fetching chatroom:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

const getDatabaseConnection = require("../config/db");

// Controller to get chatroom_id based on standard, division, and return student_id
exports.getChatroomId = async (req, res) => {
  const { college_db } = req.params;
  const { standard, division, student_id } = req.body;

  try {
    const db = getDatabaseConnection(college_db);

    const [rows] = await db.execute(
      `SELECT id AS chatroom_id FROM chat_rooms WHERE standard = ? AND division = ?`,
      [standard, division]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Chatroom not found" });
    }

    const chatroom_id = rows[0].chatroom_id;

    return res.status(200).json({
      student_id,
      chatroom_id
    });
  } catch (error) {
    console.error("Error fetching chatroom:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
