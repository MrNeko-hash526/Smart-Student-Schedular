📚 Smart Student Scheduler
Smart Student Scheduler is a full-stack web application designed to help students manage their study life effectively. It allows students to track tasks, organize subjects, plan study sessions, and analyze their progress—all from one central platform.

✨ Features
🧠 Dashboard with quick stats and recent activity

🗓️ Calendar View for study sessions and deadlines

✅ Task Management (create, edit, delete, mark complete)

📚 Subject Organizer to manage study areas

⏱️ Study Session Tracker

📊 Analytics Dashboard to track performance and progress

📱 Responsive Design for mobile and desktop

🛠️ Tech Stack
Frontend: React

Backend: Express

Database: PostgreSQL (hosted on Neon)

Styling: Tailwind CSS

🚀 Getting Started
✅ Prerequisites
Node.js (v18 or newer)

npm

📥 Installation
Clone the repository:

bash
Copy
Edit
git clone https://github.com/MrNeko-hash526/Smart-Student-Schedular.git
cd Smart-Student-Schedular
Install dependencies:

bash
Copy
Edit
npm install
Configure environment:

Create a .env file in the root with your PostgreSQL connection:

env
Copy
Edit
DATABASE_URL=your_neon_postgres_url_here
PORT=5000
Set up the database schema:
(Refer to the shared/ directory for schema management via Drizzle ORM.)

🧪 Running the App
🔧 Frontend only
bash
Copy
Edit
npm run dev:frontend
🌐 Full stack (frontend + backend)
bash
Copy
Edit
npm run dev
📁 Project Structure
pgsql
Copy
Edit
Smart-Student-Schedular/
├── client/       → React frontend
├── server/       → Express backend
├── shared/       → Shared database schema (Drizzle ORM)
├── .env          → Environment variables
└── README.md
📄 License
This project is licensed under the MIT License.
