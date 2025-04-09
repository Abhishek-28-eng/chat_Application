const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const getDatabaseConnection = require("./config/db"); // ✅ Import DB connection

dotenv.config();

const app = express();
const server = http.createServer(app);

// 🔹 Initialize Socket.io with CORS settings
const io = socketIo(server, {
    cors: {
        origin: "*",  // ✅ Update with your frontend URL if needed
        methods: ["GET", "POST"],
        credentials: true
    }
});

app.use(express.json());
app.use(cors());

// 🔹 Import Routes
const chatRoutes = require("./routes/chatRoutes");
app.use("/api", chatRoutes);
app.use("/images", express.static("/home/chat_app_image"));

// 🔹 WebSocket Event Handling
io.on("connection", (socket) => {
    console.log("✅ New user connected:", socket.id);

    // ✅ User Joins Room & Gets Chat History
    socket.on("join_room", async (chatroomId, college_db) => {
        if (!chatroomId || !college_db) {
            console.error("❌ Invalid chatroom data:", { chatroomId, college_db });
            return;
        }

        socket.join(chatroomId);
        console.log(`👥 User ${socket.id} joined room: ${chatroomId}`);

        try {
            const db = getDatabaseConnection(college_db);
            const query = `SELECT sender_id, message_text, timestamp FROM messages WHERE chatroom_id = ? ORDER BY timestamp ASC`;
            const [rows] = await db.execute(query, [chatroomId]);

            // ✅ Send chat history to the new user
            socket.emit("chat_history", rows);
        } catch (error) {
            console.error("❌ Error fetching chat history:", error);
        }
    });

    // ✅ Send a message (Save in DB + Broadcast)
    socket.on("send_message", async (data) => {
        console.log("📨 Received message event:", data);
    
        const { chatroom_id, sender_id, message_text, college_db = "MGVP" } = data;
        const timestamp = new Date().toLocaleTimeString(); // ✅ Use local time format
    
        if (!chatroom_id || !sender_id || !message_text || !college_db) {
            console.error("❌ Missing message data:", data);
            return;
        }
    
        try {
            const db = getDatabaseConnection(college_db);
    
            // ✅ Save message to MySQL (timestamp stored as VARCHAR)
            const query = `INSERT INTO messages (chatroom_id, sender_id, message_text, timestamp) VALUES (?, ?, ?, ?)`;
            await db.execute(query, [chatroom_id, sender_id, message_text, timestamp]);
    
            console.log("✅ Message saved:", message_text);
    
            // ✅ Broadcast message with formatted timestamp
            const messageData = {
                chatroom_id,
                sender_id,
                message_text,
                timestamp // ✅ Use formatted time instead of Date object
            };
    
            console.log("📢 Broadcasting message:", messageData);
    
            io.to(chatroom_id).emit("new_message", messageData); // ✅ Broadcast message
    
        } catch (error) {
            console.error("❌ Error saving message:", error);
        }
    });
    
    

    // ✅ Handle user disconnection
    socket.on("disconnect", () => {
        console.log("❌ User disconnected:", socket.id);
    });
});

// 🔹 Start Server
const PORT = process.env.PORT || 8001;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
