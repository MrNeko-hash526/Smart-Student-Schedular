import { apiRequest } from "./queryClient";

// Types for API responses
export interface DashboardStats {
  todayTasks: number;
  studyHours: string;
  completed: string;
  streak: string;
  upcomingDeadlines: number;
}

export interface StudyPlanRequest {
  taskId: number;
  availableHours: number;
  difficultyLevel: string;
}

export interface StudyPlanResponse {
  message: string;
  sessions: any[];
  totalSessions: number;
  estimatedCompletion: number;
}

// API functions
export const api = {
  // Tasks
  tasks: {
    getAll: () => apiRequest("GET", "/api/tasks"),
    create: (task: any) => apiRequest("POST", "/api/tasks", task),
    update: (id: number, task: any) => apiRequest("PUT", `/api/tasks/${id}`, task),
    delete: (id: number) => apiRequest("DELETE", `/api/tasks/${id}`),
    getUpcoming: (days?: number) => apiRequest("GET", `/api/tasks/upcoming${days ? `?days=${days}` : ""}`),
  },

  // Subjects
  subjects: {
    getAll: () => apiRequest("GET", "/api/subjects"),
    create: (subject: any) => apiRequest("POST", "/api/subjects", subject),
  },

  // Study Sessions
  studySessions: {
    getAll: () => apiRequest("GET", "/api/study-sessions"),
    getToday: () => apiRequest("GET", "/api/study-sessions/today"),
    create: (session: any) => apiRequest("POST", "/api/study-sessions", session),
    update: (id: number, session: any) => apiRequest("PUT", `/api/study-sessions/${id}`, session),
  },

  // Analytics
  stats: {
    getDashboard: (): Promise<Response> => apiRequest("GET", "/api/stats/dashboard"),
  },

  // AI Study Planner
  studyPlan: {
    generate: (request: StudyPlanRequest): Promise<Response> => 
      apiRequest("POST", "/api/study-plan/generate", request),
  },
};
