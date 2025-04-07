const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const server = http.createServer(app);

// 🔹 Initialize Socket.io with CORS settings
const io = socketIo(server, {
    cors: {
        origin: "*",  // ✅ Update with your frontend URL
        methods: ["GET", "POST"],
        credentials: true
    }
});

app.use(express.json());
app.use(cors());

// 🔹 Import Routes
const chatRoutes = require("./routes/chatRoutes");
app.use("/api", chatRoutes);

// 🔹 WebSocket Event Handling
io.on("connection", (socket) => {
    console.log("✅ New user connected:", socket.id);

    // Join a chatroom
    socket.on("join_room", (chatroomId) => {
        socket.join(chatroomId);
        console.log(`👥 User ${socket.id} joined room: ${chatroomId}`);
    });

    // Send a message to a chatroom
    socket.on("send_message", (data) => {
        io.to(data.chatroom_id).emit("new_message", data);
        console.log(`📩 Message sent to room ${data.chatroom_id}:`, data);
    });

    // Handle user disconnection
    socket.on("disconnect", () => {
        console.log("❌ User disconnected:", socket.id);
    });
});

// 🔹 Start Server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
