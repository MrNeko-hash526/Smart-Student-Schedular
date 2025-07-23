# 📚 Smart Student Scheduler

**Smart Student Scheduler** is a full-stack web application designed to help students manage their study life effectively. It allows students to track tasks, organize subjects, plan study sessions, and analyze their progress — all from one central platform.

---

## Features

- 📚 Subject management with priorities and progress tracking
- 📅 Study session scheduling with time slots
- 📊 Progress analytics with interactive charts
- 🔐 User authentication with Supabase
- 📱 Responsive design for all devices

---

## 🛠️ Tech Stack

- **Frontend:** React  
- **Backend:** Express  
- **Database:** PostgreSQL (hosted on Neon)  
- **Styling:** Tailwind CSS  

---

## 🚀 Getting Started

### ✅ Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer)
- npm

### 📥 Installation

1. **Clone the repository:**

```bash
git clone https://github.com/MrNeko-hash526/Smart-Student-Schedular.git
cd Smart-Student-Schedular

Install dependencies:
```
npm install
```
Configure environment:
```
DATABASE_URL=your_neon_postgres_url_here
PORT=5000
```

env
Copy
Edit
DATABASE_URL=your_neon_postgres_url_here
PORT=5000
Set up the database schema:
(Refer to the shared/ directory for schema management via Drizzle ORM.)

🧪 Running the App
🔧 Frontend only
```
npm run dev:frontend
```
🌐 Full stack (frontend + backend)
```
npm run dev
```
📁 Project Structure
```
Smart-Student-Schedular/
├── client/       → React frontend
├── server/       → Express backend
├── shared/       → Shared database schema (Drizzle ORM)
├── .env          → Environment variables
└── README.md     → Project documentation
```
📄 License
This project is licensed under the MIT License.
