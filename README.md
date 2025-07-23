# 📚 Smart Student Scheduler

**Smart Student Scheduler** is a full-stack web application designed to help students manage their study life effectively. It allows students to track tasks, organize subjects, plan study sessions, and analyze their progress — all from one central platform.

---

## ✨ Features

- **🧠 Dashboard**  
  View quick stats and recent activity to stay updated on your progress.

- **🗓️ Calendar View**  
  Schedule and visualize your study sessions and deadlines with ease.

- **✅ Task Management**  
  Create, edit, delete, and mark tasks as complete to stay organized.

- **📚 Subject Organizer**  
  Categorize and manage your study areas efficiently.

- **⏱️ Study Session Tracker**  
  Track the time you spend studying and build consistent habits.

- **📊 Analytics Dashboard**  
  Monitor your performance and progress through visual insights.

- **📱 Responsive Design**  
  Optimized for both mobile and desktop use.


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
## Database Setup
```
1. Create a new Supabase project
2. Run the SQL migration in `supabase/migrations/create_study_scheduler_complete.sql`
3. Update your environment variables with the project URL and anon key

🧪 Running the App
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
