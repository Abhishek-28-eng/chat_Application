const WebSocket = require("ws");

const ws = new WebSocket("ws://localhost:8080");

ws.on("open", () => {
  console.log("✅ Connected to WebSocket server");
});

ws.on("message", (message) => {
  console.log("📩 Message Received:", message.toString());
});

ws.on("error", (error) => {
  console.error("❌ WebSocket Error:", error);
});

ws.on("close", () => {
  console.log("🔴 Disconnected from WebSocket server");
});
