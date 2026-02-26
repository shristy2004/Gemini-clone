# 🤖 Gemini AI Clone – Frontend (React.js)

A frontend web application built using **React.js**, inspired by Google Gemini.  
This project integrates the **Gemini REST API** directly from the frontend to simulate an AI-powered chatbot experience.

⚠ This is a frontend-only project (no backend server included).

---

## 🚀 Live Demo

🔗 Add your deployed link here (Vercel / Netlify)

---

## ✨ Features

- 💬 Interactive AI chat interface
- 🔗 Direct REST API integration (Gemini API)
- ⚡ Real-time response rendering
- 🧠 Prompt-based interaction
- 🎨 Clean and minimal UI
- 📱 Responsive design

---

## 🛠 Tech Stack

- ⚛ React.js
- 🌐 Gemini REST API
- 📦 Fetch API / Axios
- 🎨 CSS
- 📜 JavaScript (ES6+)

---

## 🔗 API Integration (Frontend)

The application sends user prompts directly to the Gemini REST API and displays AI-generated responses.

Example API call:

```javascript
fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    contents: [{
      parts: [{ text: userInput }]
    }]
  }),
});
