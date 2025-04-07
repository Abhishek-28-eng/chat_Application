import { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:8080");

export default function StudentChat({ studentId }) {
  const [standard, setStandard] = useState("");
  const [division, setDivision] = useState("");
  const [message, setMessage] = useState("");
  const [chatroomId, setChatroomId] = useState(null);
  const [messages, setMessages] = useState([]);
  const college_db = "MGVP";

  const joinChatroom = async () => {
    const res = await axios.post(`http://localhost:8080/api/${college_db}/getChatroomId`, {
      standard,
      division
    });
    const roomId = res.data.chatroom_id;
    setChatroomId(roomId);
    socket.emit("join_room", roomId, college_db);
  };

  const sendMessage = () => {
    if (!chatroomId) return;
    socket.emit("send_message", {
      chatroom_id: chatroomId,
      sender_id: studentId,
      message_text: message,
      college_db
    });
    setMessage("");
  };

  useEffect(() => {
    socket.on("chat_history", (msgs) => setMessages(msgs));
    socket.on("new_message", (msg) => setMessages((prev) => [...prev, msg]));

    return () => {
      socket.off("chat_history");
      socket.off("new_message");
    };
  }, []);

  return (
    <div>
      <h2>Student Chat</h2>
      {!chatroomId ? (
        <div>
          <input placeholder="Standard" value={standard} onChange={(e) => setStandard(e.target.value)} />
          <input placeholder="Division" value={division} onChange={(e) => setDivision(e.target.value)} />
          <button onClick={joinChatroom}>Join Chat</button>
        </div>
      ) : (
        <div>
          <div>
            {messages.map((msg, idx) => (
              <p key={idx}><b>{msg.sender_id}</b>: {msg.message_text} ({msg.timestamp})</p>
            ))}
          </div>
          <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message" />
          <button onClick={sendMessage}>Send</button>
        </div>
      )}
    </div>
  );
}
