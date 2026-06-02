const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// 1. JDoodle Endpoint (Execute Java Code)
app.post('/api/execute', async (req, res) => {
  const { code } = req.body;
  
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

// 2. Gemini Endpoint (AI Code Review)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/review', async (req, res) => {
  const { code, taskDescription } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
      You are a Senior Java Architect at a top tech company. 
      Review this student's code based on this task: "${taskDescription}".
      Code: "${code}"
      Provide:
      1. A professional critique (Encapsulation, Naming, Efficiency).
      2. A "Corporate Grade" version of the code.
      3. A brief explanation of why the change is better for production.
      Keep the tone encouraging but professional.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.json({ feedback: response.text() });
  } catch (error) {
    console.error("AI Review failed:", error.message);
    res.status(500).json({ error: "AI Review failed" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
