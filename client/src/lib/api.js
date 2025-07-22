import { apiRequest } from "./queryClient";

// API functions
export const api = {
  // Tasks
  tasks: {
    getAll: () => apiRequest("GET", "/api/tasks"),
    create: (task) => apiRequest("POST", "/api/tasks", task),
    update: (id, task) => apiRequest("PUT", `/api/tasks/${id}`, task),
    delete: (id) => apiRequest("DELETE", `/api/tasks/${id}`),
    getUpcoming: (days) => apiRequest("GET", `/api/tasks/upcoming${days ? `?days=${days}` : ""}`),
  },

  // Subjects
  subjects: {
    getAll: () => apiRequest("GET", "/api/subjects"),
    create: (subject) => apiRequest("POST", "/api/subjects", subject),
  },

  // Study Sessions
  studySessions: {
    getAll: () => apiRequest("GET", "/api/study-sessions"),
    getToday: () => apiRequest("GET", "/api/study-sessions/today"),
    create: (session) => apiRequest("POST", "/api/study-sessions", session),
    update: (id, session) => apiRequest("PUT", `/api/study-sessions/${id}`, session),
  },

  // Analytics
  stats: {
    getDashboard: () => apiRequest("GET", "/api/stats/dashboard"),
  },

  // AI Study Planner
  studyPlan: {
    generate: (request) => 
      apiRequest("POST", "/api/study-plan/generate", request),
  },
};
