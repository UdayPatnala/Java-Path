# JavaPath Pro 🚀

> **Interactive Enterprise Java Learning Engine & Sandboxed Compilation Platform**  
> *Designed, Architected, and Developed by **Patnala Uday Kumar***  
> 🔗 **Repository**: [https://github.com/UdayPatnala/Java-Path](https://github.com/UdayPatnala/Java-Path)

---

## 📌 Project Overview

**JavaPath Pro** is a full-stack, enterprise-grade interactive platform built to train engineers in modern Java (Java 17 LTS), architectural design patterns, and enterprise software engineering workflows.

Unlike standard tutorial platforms, JavaPath Pro emulates real-world engineering environments by integrating a **real-time static compiler diagnostics engine**, **remote sandboxed code execution**, a **backlog simulation mode**, and an **intelligent Staff Code Mentor** that evaluates code against standard vs. production-grade design patterns.

---

## ⭐ Key Features

- 🧑‍💻 **Interactive In-Browser IDE**: Built-in code editor with syntax highlighting, auto-formatting, and diagnostic error overlays.
- ⚡ **Real-Time Compiler Diagnostics**: Lightweight static parser analyzing bracket matching, semicolons, and syntax hygiene before execution.
- 🔒 **Sandboxed Java Execution**: Remote sandbox compilation executing Java 17 programs with instant runtime output.
- 🏢 **Corporate Backlog Simulation**: Guided tasks simulating real corporate engineering tickets (Encapsulation, Authentication Routers, Transaction Aggregators, Polymorphic Payment Adapters).
- 🧠 **Staff Code Mentor**: Contextual AI staff engineer providing dual solution recommendations (Standard vs. Production-Grade refactors).
- 🏆 **Gamified Career Progression**: Track completed challenges, unlock achievements, and level up from *Junior Intern* to *Mid-Level Engineer*.
- 🔐 **Secure Auth System**: Token-based Authentication with password hashing, persistent profiles, and state restoration.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19 + Vite 8
- **Styling**: TailwindCSS 4 (Modern glassmorphism & soft pastel aesthetic)
- **State & Routing**: React Router v7 & Context API
- **Animations & Icons**: Framer Motion & Lucide React

### Backend
- **Runtime**: Node.js & Express
- **Database & ORM**: SQLite3 & Sequelize ORM
- **Security**: JSON Web Tokens (JWT) & Bcrypt
- **Code Execution**: JDoodle Sandbox Compilation API
- **Code Intelligence**: Custom Staff Mentor Integration

---

## 📁 Repository Structure

```text
Java-Path/
├── javapath-frontend/          # React 19 + Vite Frontend Application
│   ├── src/
│   │   ├── Landing.jsx         # Hero Landing Page with Product Showcase
│   │   ├── Dashboard.jsx       # Interactive Workspace IDE & Staff Mentor Drawer
│   │   ├── Login.jsx           # Auth Portal (SignIn / Register)
│   │   ├── AuthContext.jsx     # Global Authentication Provider
│   │   ├── App.jsx             # Main Application Routing
│   │   └── main.jsx            # Entry Point
│   ├── index.html              # App HTML Shell & Author Metadata
│   └── package.json            # Frontend Package Manifest
├── javapath-backend/           # Express REST API Server
│   ├── server.js               # Main API Router & Code Execution Engine
│   ├── db.js                   # SQLite Database & Sequelize Models
│   ├── .env.example            # Environment Configuration Template
│   └── package.json            # Backend Package Manifest
└── README.md                   # Repository Documentation & Credits
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v20.x or later
- **npm**: v10.x or later

### Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/UdayPatnala/Java-Path.git
   cd Java-Path
   ```

2. **Backend Configuration & Startup**
   ```bash
   cd javapath-backend
   npm install
   cp .env.example .env
   # Update .env with your environment secrets if needed
   npm start
   ```
   *The backend will run on `http://localhost:5000`.*

3. **Frontend Startup**
   ```bash
   cd ../javapath-frontend
   npm install
   npm run dev
   ```
   *Open `http://localhost:5173` in your browser.*

---

## 👨‍💻 Sole Author & Developer

| Developer | Role | GitHub |
| :--- | :--- | :--- |
| **Patnala Uday Kumar** | Sole Creator, Architect & Full-Stack Engineer | [@UdayPatnala](https://github.com/UdayPatnala) |

> **Statement of Attribution**:  
> JavaPath Pro was designed, architected, and engineered solely by **Patnala Uday Kumar**. All user interfaces, code compilers, backend routing, database schemas, and documentation are authored and maintained by Patnala Uday Kumar.

---

## 📄 License

This project is released under the **ISC License**.  
&copy; 2026 **Patnala Uday Kumar**. All rights reserved.
