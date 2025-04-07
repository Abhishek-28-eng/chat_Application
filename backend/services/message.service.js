// /services/message.service.js
const getDatabaseConnection = require("../config/db");

// Service to save a message
exports.saveMessageToDB = async (college_db, chatroom_id, sender_id, message_text) => {
    const db = getDatabaseConnection(college_db);

    try {
        const [result] = await db.execute(
            `INSERT INTO messages (chatroom_id, sender_id, message_text) 
             VALUES (?, ?, ?)`, 
            [chatroom_id, sender_id, message_text]
        );
        return result;
    } catch (error) {
        throw new Error('Error saving message to database');
    }
};

// Service to fetch chat history
exports.fetchChatHistoryFromDB = async (college_db, chatroom_id) => {
    const db = getDatabaseConnection(college_db);

    try {
        const [messages] = await db.execute(
            `SELECT sender_id, message_text, timestamp 
             FROM messages 
             WHERE chatroom_id = ? 
             ORDER BY timestamp ASC`, 
            [chatroom_id]
        );
        return messages;
    } catch (error) {
        throw new Error('Error fetching chat history');
    }
};
