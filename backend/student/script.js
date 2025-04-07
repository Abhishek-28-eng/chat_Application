const socket = io("http://localhost:8080"); // Change to your hosted URL if needed

let studentId = "";
let collegeDb = "MGVP"; // default or dynamic value
let chatroomId = "";

async function joinChatroom() {
  studentId = document.getElementById("studentId").value.trim();
  const standard = document.getElementById("standard").value.trim();
  const division = document.getElementById("division").value.trim();

  if (!studentId || !standard || !division) {
    alert("Please fill all the fields.");
    return;
  }

  try {
    // Get chatroom_id from API
    const res = await axios.post(`http://localhost:8080/api/${collegeDb}/getChatroomId`, {
      standard,
      division
    });

    chatroomId = res.data.chatroom_id;

    // Join Socket.io room
    socket.emit("join_room", chatroomId, collegeDb);

    document.getElementById("join-form").style.display = "none";
    document.getElementById("chatroom").style.display = "block";

  } catch (err) {
    console.error("Error joining chatroom:", err);
    alert("Chatroom not found or error occurred.");
  }
}

function sendMessage() {
  const messageInput = document.getElementById("messageInput");
  const messageText = messageInput.value.trim();
  if (!messageText) return;

  socket.emit("send_message", {
    chatroom_id: chatroomId,
    sender_id: studentId,
    message_text: messageText,
    college_db: collegeDb
  });

  messageInput.value = "";
}

socket.on("chat_history", (messages) => {
  const messagesDiv = document.getElementById("messages");
  messagesDiv.innerHTML = "";

  messages.forEach(msg => {
    const p = document.createElement("p");
    p.innerHTML = `<strong>${msg.sender_id}</strong>: ${msg.message_text} <em>${msg.timestamp}</em>`;
    messagesDiv.appendChild(p);
  });

  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

socket.on("new_message", (msg) => {
  const messagesDiv = document.getElementById("messages");
  const p = document.createElement("p");
  p.innerHTML = `<strong>${msg.sender_id}</strong>: ${msg.message_text} <em>${msg.timestamp}</em>`;
  messagesDiv.appendChild(p);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});
