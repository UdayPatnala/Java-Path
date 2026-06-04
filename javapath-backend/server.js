const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const { User } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_corporate_key_2026';

// --- Authentication Middleware ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: "Access Denied" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid Token" });
    req.user = user;
    next();
  });
};

// --- Auth Endpoints with deep validation ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Strict validations
    if (!username || !password || username.trim() === "" || password.trim() === "") {
      return res.status(400).json({ error: "Username and password are required." });
    }
    if (username.trim().length < 3) {
      return res.status(400).json({ error: "Username must be at least 3 characters long." });
    }
    if (password.trim().length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long." });
    }

    const hashedPassword = await bcrypt.hash(password.trim(), 10);
    const user = await User.create({ username: username.trim(), password: hashedPassword });
    res.json({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ error: "Username might already exist." });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password || username.trim() === "" || password.trim() === "") {
      return res.status(400).json({ error: "Username and password are required." });
    }

    const user = await User.findOne({ where: { username: username.trim() } });
    if (!user) return res.status(400).json({ error: "User not found" });

    const validPassword = await bcrypt.compare(password.trim(), user.password);
    if (!validPassword) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
    res.json({ token, username: user.username, progress: user.progress || [], chatHistory: user.chatHistory || [] });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

// --- Progress Endpoints ---
app.get('/api/progress', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    res.json({ progress: user.progress || [] });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch progress" });
  }
});

app.post('/api/progress', authenticateToken, async (req, res) => {
  try {
    const { completedDays } = req.body;
    if (!Array.isArray(completedDays)) {
      return res.status(400).json({ error: "Completed days must be an array." });
    }
    const user = await User.findByPk(req.user.id);
    user.progress = completedDays;
    await user.save();
    res.json({ success: true, progress: user.progress });
  } catch (err) {
    res.status(500).json({ error: "Failed to update progress" });
  }
});

// --- JDoodle Endpoint (Execute Java Code) ---
app.post('/api/execute', authenticateToken, async (req, res) => {
  const { code } = req.body;

  if (!code || code.trim() === "") {
    return res.status(400).json({ error: "Cannot execute empty code." });
  }
  
  const program = {
    script: code,
    language: "java",
    versionIndex: "4", // Java 17
    clientId: process.env.JDOODLE_CLIENT_ID,
    clientSecret: process.env.JDOODLE_CLIENT_SECRET
  };

  try {
    const response = await axios.post('https://api.jdoodle.com/v1/execute', program);
    res.json(response.data);
  } catch (error) {
    console.error("Execution failed:", error?.response?.data || error.message);
    res.status(500).json({ error: "Execution failed" });
  }
});

// --- Gemini Endpoint (AI Code Review w/ Chat History) ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy_key");

app.post('/api/chat', authenticateToken, async (req, res) => {
  const { message, code, taskDescription, assistanceLevel } = req.body;

  if (!message || message.trim() === "") {
    return res.status(400).json({ error: "Message cannot be empty." });
  }

  // Handle case where API Key is not configured to fail gracefully
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: "AI Mentor is currently offline (API Key missing)." });
  }

  try {
    const user = await User.findByPk(req.user.id);
    const history = user.chatHistory || [];

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const chat = model.startChat({
      history: history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }))
    });

    const isBasic = assistanceLevel === 'basic';

    const prompt = `
      Current Task: "${taskDescription || 'General coding'}".
      User's Current Code: 
      \`\`\`java
      ${code || '// No code provided'}
      \`\`\`
      User Message: ${message}

      Assistance Rules (CRITICAL):
      Assistance Level Selected: ${isBasic ? 'BASIC GUIDANCE' : 'MAX SOLUTION'}.
      ${isBasic ? 
        '- DO NOT write the full code solution for the user. Instead, explain the logic, point out compilation/logical errors in their code, and give snippets or pseudocode. Force them to learn by writing the solution themselves.' : 
        '- Provide the complete, production-grade refactored code solution. Explain the logic and implementation in detail.'
      }

      Always present two solution recommendations:
      1. A "Good/Standard" solution (e.g. basic syntax or standard loops).
      2. A "Better/Best" solution (e.g. using modern Java 17 features like Streams, Lambdas, records, or design patterns).
      
      Respond as a Senior Java Architect. Keep the tone encouraging but highly professional.
    `;

    const result = await chat.sendMessage(prompt);
    const responseText = await result.response.text();

    // Update history
    const newHistory = [
      ...history,
      { role: "user", text: message },
      { role: "model", text: responseText }
    ];
    user.chatHistory = newHistory;
    await user.save();

    res.json({ response: responseText, history: newHistory });
  } catch (error) {
    console.error("AI Chat failed:", error.message);
    res.status(500).json({ error: "AI Chat failed to process instructions." });
  }
});

app.post('/api/chat/clear', authenticateToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        user.chatHistory = [];
        await user.save();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Failed to clear chat history" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
