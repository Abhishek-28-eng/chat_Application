const getDatabaseConnection = require("../config/db");

// ✅ Find or Create a Chatroom
exports.getOrCreateChatRoom = async (req, res) => {
    const { college_db } = req.params; // Ensure this is correctly passed
    const { standard, division } = req.body;

    if (!college_db) {
        return res.status(400).json({ message: "Database name (college_db) is required!" });
    }

    try {
        const db = await getDatabaseConnection(college_db); // Use correct school DB

        // Check if the chat room exists
        const [room] = await db.execute(
            `SELECT id FROM chat_rooms WHERE standard = ? AND division = ?`,
            [standard, division]
        );

        let roomId;
        if (room.length > 0) {
            roomId = room[0].id;
        } else {
            // Create a new chat room
            const [newRoom] = await db.execute(
                `INSERT INTO chat_rooms (standard, division) VALUES (?, ?)`,
                [standard, division]
            );
            roomId = newRoom.insertId;
        }

        res.json({ chatroom_id: roomId, message: "Chatroom ready" });
    } catch (error) {
        console.error("Error fetching/creating chatroom:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
