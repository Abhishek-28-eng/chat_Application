// const express = require('express');
// const router = express.Router();
// const { ChatRoom, Message } = require('../models');

// // Join chatroom based on standard & division
// router.post('/join-student-chatroom', async (req, res) => {
//   const { standard, division, student_id } = req.body;

//   try {
//     const chatroom = await ChatRoom.findOne({ where: { standard, division } });

//     if (!chatroom) {
//       return res.status(404).json({ message: "Chatroom not found" });
//     }

//     const messages = await Message.findAll({
//       where: { chatroom_id: chatroom.id },
//       order: [['timestamp', 'ASC']]
//     });

//     res.json({ chatroom_id: chatroom.id, messages });
//   } catch (error) {
//     console.error("Join Chatroom Error:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// module.exports = router;