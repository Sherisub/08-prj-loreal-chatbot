const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// Display welcome message
appendMessage("bot", "👋 Hello! How can I help you today?");

// Handle user form submission
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = userInput.value.trim();
  if (!message) return;

  // Append user's message
  appendMessage("user", message);
  userInput.value = "";

  // Temporary loading message
  const loadingMsg = appendMessage("bot", "💬 Thinking...");

  try {
    // Send user input to your Cloudflare Worker API
    const response = await fetch("https://your-cloudflare-worker-url.workers.dev", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: message }),
    });

    const result = await response.json();
    const reply = result.choices?.[0]?.message?.content || "Sorry, I couldn't understand that.";

    // Replace loading message with response
    loadingMsg.textContent = reply;
  } catch (err) {
    loadingMsg.textContent = "⚠️ Failed to fetch response. Please try again.";
    console.error(err);
  }
});

// Append message bubble to chat window
function appendMessage(sender, text) {
  const msg = document.createElement("div");
  msg.className = `chat-message ${sender}`;
  msg.textContent = text;
  chatWindow.appendChild(msg);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return msg;
}
