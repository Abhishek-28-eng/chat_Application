const express = require("express");
const router = express.Router();
const chatController = require("../controllers/teacher.subject");
const teachersubjectconteroller = require("../controllers/teacher.chatrooms");
const messageController = require('../controllers/message.controller');
const studentsController = require("../controllers/studentController");
const { getUserNameById } = require("../controllers/studentteacher.controller.js");

// 🔹 Fetch subjects assigned to a teacher
router.get("/subjects/:college_db/:teacher_code", chatController.getTeacherSubjects);

// ✅ 2️⃣ Find or create a chatroom based on standard & division
router.post("/:college_db/chatroom", teachersubjectconteroller.getOrCreateChatRoom);

// Route to save a message
router.post('/saveMessage/:college_db', messageController.saveMessage);

// Route to get chat history
router.get('/getChatHistory/:college_db/:chatroom_id', messageController.getChatHistory);

/// POST: Get chatroom ID for a student based on standard and division
router.post("/:college_db/getChatroomId", studentsController.getChatroomId);

router.get("/get-name/:college_db/:role/:id", getUserNameById);


module.exports = router;
                                                                                                                