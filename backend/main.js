const socket = io("http://localhost:8080", { transports: ["websocket"] });

document.getElementById("fetch-subjects").addEventListener("click", fetchSubjects);
document.getElementById("create-chatroom").addEventListener("click", createChatroom);
document.getElementById("send-message").addEventListener("click", sendMessage);

let currentChatroomId = null;
let currentCollegeDb = null;

// ✅ Fetch subjects for a teacher
async function fetchSubjects() {
    const college_db = document.getElementById("college_db").value;
    const teacher_code = document.getElementById("teacher_code").value;

    if (!college_db || !teacher_code) {
        alert("Please enter both College DB and Teacher Code!");
        return;
    }

    try {
        const response = await axios.get(`http://localhost:8080/api/subjects/${college_db}/${teacher_code}`);
        const subjects = response.data.subjects;
        const subjectsDiv = document.getElementById("subjects-list");
        subjectsDiv.innerHTML = subjects.map(subject => `<p>${subject}</p>`).join('');
    } catch (error) {
        console.error("❌ Error fetching subjects:", error);
        alert("Failed to fetch subjects. Check the console.");
    }
}

// ✅ Create or join a chatroom
async function createChatroom() {
    const college_db = document.getElementById("college_db").value;
    const standard = document.getElementById("standard").value;
    const division = document.getElementById("division").value;

    if (!college_db || !standard || !division) {
        alert("Please enter all fields to create or join a chatroom!");
        return;
    }

    try {
        const response = await axios.post(`http://localhost:8080/api/${college_db}/chatroom`, { standard, division });
        const chatroomId = response.data.chatroom_id;
        currentChatroomId = chatroomId;
        currentCollegeDb = college_db;

        document.getElementById("chatroom-info").innerHTML = `Joined Chatroom ID: ${chatroomId}`;

        // Join via WebSocket
        socket.emit("join_room", chatroomId, college_db);

        // Load chat history
        fetchChatHistory(chatroomId, college_db);
    } catch (error) {
        console.error("❌ Error creating/joining chatroom:", error);
        alert("Failed to create/join chatroom.");
    }
}

// ✅ Load chat history
async function fetchChatHistory(chatroomId, college_db) {
    try {
        const response = await axios.get(`http://localhost:8080/api/getChatHistory/${college_db}/${chatroomId}`);
        const chatBox = document.getElementById("chat-box");
        chatBox.innerHTML = "";

        response.data.messages.forEach(msg => appendMessageToChatBox(msg));
    } catch (error) {
        console.error("❌ Error fetching chat history:", error);
        alert("Failed to load chat history.");
    }
}

// ✅ Send a message
async function sendMessage() {
    const message = document.getElementById("message").value;
    const sender_id = document.getElementById("teacher_code").value;

    if (!message || !currentChatroomId || !sender_id) {
        alert("Please enter a message and join a chatroom first!");
        return;
    }

    const messageData = {
        chatroom_id: currentChatroomId,
        sender_id: sender_id,
        message_text: message,
        timestamp: new Date().toISOString(),
    };

    // Emit to WebSocket
    socket.emit("send_message", messageData);

    // Show immediately in chat
    appendMessageToChatBox(messageData);

    try {
        await axios.post(`http://localhost:8080/api/saveMessage/${currentCollegeDb}`, messageData, {
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error("❌ Error saving message:", error.response ? error.response.data : error);
    }

    document.getElementById("message").value = "";
}

// ✅ Append message to chat box
function appendMessageToChatBox(data) {
    const chatBox = document.getElementById("chat-box");
    const messageContainer = document.createElement("div");
    messageContainer.classList.add("message");

    const time = new Date(data.timestamp).toLocaleTimeString();
    messageContainer.innerHTML = `<strong>${data.sender_id}</strong>: ${data.message_text} <small>${time}</small>`;
    chatBox.appendChild(messageContainer);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// ✅ WebSocket listener
socket.on("new_message", (data) => {
    appendMessageToChatBox(data);
});
