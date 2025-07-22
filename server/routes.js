import { createServer } from "http";
import { storage } from "./storage";
import { insertTaskSchema, insertStudySessionSchema, insertSubjectSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app) {
  // Demo user ID for simplicity - in a real app, this would come from authentication
  const DEMO_USER_ID = 1;

  // Tasks routes
  app.get("/api/tasks", async (req, res) => {
    try {
      const tasks = await storage.getTasks(DEMO_USER_ID);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const taskData = insertTaskSchema.parse({
        ...req.body,
        userId: DEMO_USER_ID,
      });
      const task = await storage.createTask(taskData);
      res.status(201).json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Validation error", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create task" });
      }
    }
  });

  app.put("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const task = await storage.updateTask(id, updates);
      
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: "Failed to update task" });
    }
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteTask(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete task" });
    }
  });

  app.get("/api/tasks/upcoming", async (req, res) => {
    try {
      const days = req.query.days ? parseInt(req.query.days) : 7;
      const tasks = await storage.getUpcomingTasks(DEMO_USER_ID, days);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch upcoming tasks" });
    }
  });

  // Subjects routes
  app.get("/api/subjects", async (req, res) => {
    try {
      const subjects = await storage.getSubjects(DEMO_USER_ID);
      res.json(subjects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch subjects" });
    }
  });

  app.post("/api/subjects", async (req, res) => {
    try {
      const subjectData = insertSubjectSchema.parse({
        ...req.body,
        userId: DEMO_USER_ID,
      });
      const subject = await storage.createSubject(subjectData);
      res.status(201).json(subject);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Validation error", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create subject" });
      }
    }
  });

  // Study Sessions routes
  app.get("/api/study-sessions", async (req, res) => {
    try {
      const sessions = await storage.getStudySessions(DEMO_USER_ID);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch study sessions" });
    }
  });

  app.get("/api/study-sessions/today", async (req, res) => {
    try {
      const sessions = await storage.getTodaysSessions(DEMO_USER_ID);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch today's sessions" });
    }
  });

  app.post("/api/study-sessions", async (req, res) => {
    try {
      const sessionData = insertStudySessionSchema.parse({
        ...req.body,
        userId: DEMO_USER_ID,
      });
      const session = await storage.createStudySession(sessionData);
      res.status(201).json(session);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Validation error", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create study session" });
      }
    }
  });

  app.put("/api/study-sessions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const session = await storage.updateStudySession(id, updates);
      
      if (!session) {
        return res.status(404).json({ message: "Study session not found" });
      }
      
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to update study session" });
    }
  });

  // Analytics and Stats routes
  app.get("/api/stats/dashboard", async (req, res) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const tasks = await storage.getTasks(DEMO_USER_ID);
      const todaysSessions = await storage.getTodaysSessions(DEMO_USER_ID);
      const upcomingTasks = await storage.getUpcomingTasks(DEMO_USER_ID, 7);
      
      // Calculate stats
      const todayTasks = tasks.filter(task => {
        const dueDate = task.dueDate;
        return dueDate === today;
      }).length;
      
      const completedTasks = tasks.filter(task => task.status === "completed").length;
      const totalTasks = tasks.length;
      const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      
      const studyHoursToday = todaysSessions.reduce((total, session) => {
        return total + (session.actualDuration || 0);
      }, 0) / 60; // Convert minutes to hours
      
      const stats = {
        todayTasks,
        studyHours: studyHoursToday.toFixed(1) + "h",
        completed: completionRate + "%",
        streak: "12 days", // This would be calculated based on daily stats
        upcomingDeadlines: upcomingTasks.length,
      };
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  app.post("/api/study-plan/generate", async (req, res) => {
    try {
      const { taskId, availableHours, difficultyLevel } = req.body;
      
      // Simple AI study plan generation logic
      const task = await storage.getTask(taskId);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      const estimatedHours = task.estimatedHours || 1;
      const daysUntilDue = task.dueDate 
        ? Math.max(1, Math.ceil((new Date(task.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
        : 7;
      
      // Calculate sessions needed
      const sessionsNeeded = Math.ceil(estimatedHours / availableHours);
      const sessions = [];
      
      for (let i = 0; i < sessionsNeeded; i++) {
        const sessionDate = new Date();
        sessionDate.setDate(sessionDate.getDate() + i);
        sessionDate.setHours(9 + (i * 2), 0, 0, 0); // Spread sessions throughout the day
        
        const endTime = new Date(sessionDate);
        endTime.setHours(endTime.getHours() + Math.min(availableHours, estimatedHours - (i * availableHours)));
        
        sessions.push({
          title: task.title,
          description: `Study session ${i + 1}/${sessionsNeeded}`,
          startTime: sessionDate,
          endTime: endTime,
          taskId: task.id,
          subjectId: task.subjectId,
        });
      }
      
      res.json({
        message: "Study plan generated successfully",
        sessions,
        totalSessions: sessionsNeeded,
        estimatedCompletion: daysUntilDue,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to generate study plan" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
