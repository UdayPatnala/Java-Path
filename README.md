# JavaPath Pro

An interactive full-stack learning platform designed to help junior developers master Java syntax, object-oriented concepts, and enterprise software patterns through a simulated corporate ticketing system.

## 🚀 Features

* **Interactive Sandbox IDE:** Write, compile, and run Java code directly in the browser.
* **Real-time Syntax Diagnostics:** Instant local compiler diagnostics highlighting mismatched braces, unmatched parentheses, and missing semicolons in real-time as you type.
* **Curriculum Progression:** A structured 5-task curriculum representing real-world enterprise coding scenarios:
  1. *Syntax:* Managing standard class entry point signatures.
  2. *Basics:* Encapsulating financial fields.
  3. *Logic:* Implementing access gateway filters.
  4. *Iteration:* Aggregating metrics from transaction lists.
  5. *OOP:* Writing interchangeable payment processors polymorphically.
* **Adaptive AI Mentor:** Chat with a Senior Java Architect directly in a sliding chat interface. Supports two assistance modes:
  * *Hints Only:* Guides you with logical flow and pseudocode without revealing the solution.
  * *Full Solutions:* Instantly provides a standard approach alongside a best-practice (e.g. Streams/Lambdas/Design Patterns) approach.
* **JWT-Based Authentication:** Clean user registration and login gateway with secure password encryption.
* **Persistent Progress & Profile:** User dashboard tracking challenge logs, completion stats, and dynamic career rank promotion.

## 🛠️ Tech Stack

* **Frontend:** React (v19), Vite, Tailwind CSS, Framer Motion, Axios, React Router, Lucide Icons.
* **Backend:** Node.js, Express, SQLite (via Sequelize ORM), JWT, BCrypt, Axios.
* **Compilation:** Java 17 execution environment.

---

## ⚙️ Installation & Setup

### Prerequisites
* Node.js (v18 or higher recommended)
* npm

### Step 1: Clone the Repository
```bash
git clone https://github.com/UdayPatnala/Java-Path.git
cd Java-Path
```

### Step 2: Backend Configuration
1. Navigate to the backend directory:
   ```bash
   cd javapath-backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root of `javapath-backend` using the keys below:
   ```env
   JDOODLE_CLIENT_ID=your_jdoodle_client_id
   JDOODLE_CLIENT_SECRET=your_jdoodle_client_secret
   GEMINI_API_KEY=your_gemini_api_key
   JWT_SECRET=your_secret_signing_key
   PORT=5000
   ```
4. Start the backend:
   ```bash
   npm start
   ```

### Step 3: Frontend Configuration
1. Open a new terminal window and navigate to the frontend directory:
   ```bash
   cd ../javapath-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root of `javapath-frontend`:
   ```env
   VITE_API_URL=http://localhost:5000
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser to `http://localhost:5173`.

---

## 📦 Deployment

### Frontend (Vercel)
* Set the build **Root Directory** to `javapath-frontend`.
* Add `VITE_API_URL` under Environment Variables pointing to your deployed backend URL.

### Backend (Render / Heroku)
* Set the build **Root Directory** to `javapath-backend`.
* Configure your env keys on the server and use the start command `npm start`.

---
*Created as an engineering portfolio project demonstrating full-stack React development, REST APIs, custom linter logics, relational database integration, and third-party compiler pipelines.*
