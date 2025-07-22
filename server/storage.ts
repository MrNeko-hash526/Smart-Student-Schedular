import { 
  users, 
  subjects, 
  tasks, 
  studySessions, 
  userStats,
  type User, 
  type InsertUser,
  type Subject,
  type InsertSubject,
  type Task,
  type InsertTask,
  type StudySession,
  type InsertStudySession,
  type UserStats,
  type InsertUserStats,
  type TaskWithSubject,
  type StudySessionWithDetails
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Subject methods
  getSubjects(userId: number): Promise<Subject[]>;
  getSubject(id: number): Promise<Subject | undefined>;
  createSubject(subject: InsertSubject): Promise<Subject>;
  updateSubject(id: number, subject: Partial<Subject>): Promise<Subject | undefined>;
  deleteSubject(id: number): Promise<boolean>;

  // Task methods
  getTasks(userId: number): Promise<TaskWithSubject[]>;
  getTask(id: number): Promise<TaskWithSubject | undefined>;
  createTask(task: InsertTask): Promise<TaskWithSubject>;
  updateTask(id: number, task: Partial<Task>): Promise<TaskWithSubject | undefined>;
  deleteTask(id: number): Promise<boolean>;
  getTasksByStatus(userId: number, status: string): Promise<TaskWithSubject[]>;
  getUpcomingTasks(userId: number, days?: number): Promise<TaskWithSubject[]>;

  // Study session methods
  getStudySessions(userId: number): Promise<StudySessionWithDetails[]>;
  getStudySession(id: number): Promise<StudySessionWithDetails | undefined>;
  createStudySession(session: InsertStudySession): Promise<StudySessionWithDetails>;
  updateStudySession(id: number, session: Partial<StudySession>): Promise<StudySessionWithDetails | undefined>;
  deleteStudySession(id: number): Promise<boolean>;
  getTodaysSessions(userId: number): Promise<StudySessionWithDetails[]>;

  // User stats methods
  getUserStats(userId: number, date: string): Promise<UserStats | undefined>;
  createOrUpdateUserStats(stats: InsertUserStats): Promise<UserStats>;
  getWeeklyStats(userId: number): Promise<UserStats[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private subjects: Map<number, Subject>;
  private tasks: Map<number, Task>;
  private studySessions: Map<number, StudySession>;
  private userStats: Map<string, UserStats>;
  
  private currentUserId: number;
  private currentSubjectId: number;
  private currentTaskId: number;
  private currentSessionId: number;
  private currentStatsId: number;

  constructor() {
    this.users = new Map();
    this.subjects = new Map();
    this.tasks = new Map();
    this.studySessions = new Map();
    this.userStats = new Map();
    
    this.currentUserId = 1;
    this.currentSubjectId = 1;
    this.currentTaskId = 1;
    this.currentSessionId = 1;
    this.currentStatsId = 1;

    this.initializeDemo();
  }

  private initializeDemo() {
    // Create demo user
    const demoUser: User = {
      id: 1,
      username: "demo",
      password: "demo",
      firstName: "Alex",
      lastName: "Chen",
      major: "Computer Science",
      createdAt: new Date(),
    };
    this.users.set(1, demoUser);
    this.currentUserId = 2;

    // Create demo subjects
    const subjects = [
      { id: 1, userId: 1, name: "Linear Algebra", code: "MATH 2415", color: "#2563EB", createdAt: new Date() },
      { id: 2, userId: 1, name: "Data Structures", code: "CS 3345", color: "#7C3AED", createdAt: new Date() },
      { id: 3, userId: 1, name: "Physics", code: "PHYS 2326", color: "#059669", createdAt: new Date() },
      { id: 4, userId: 1, name: "Chemistry", code: "CHEM 1312", color: "#D97706", createdAt: new Date() },
    ];
    
    subjects.forEach(subject => {
      this.subjects.set(subject.id, subject);
    });
    this.currentSubjectId = 5;

    // Create demo tasks
    const tasks = [
      {
        id: 1,
        userId: 1,
        subjectId: 1,
        title: "Chapter 5: Eigenvalues",
        description: "Study eigenvalues and eigenvectors",
        priority: "high" as const,
        status: "pending" as const,
        dueDate: "2025-03-15",
        estimatedHours: 3,
        actualHours: 0,
        createdAt: new Date(),
        completedAt: null,
      },
      {
        id: 2,
        userId: 1,
        subjectId: 2,
        title: "Binary Trees Practice",
        description: "Implement binary tree operations",
        priority: "medium" as const,
        status: "in-progress" as const,
        dueDate: "2025-03-20",
        estimatedHours: 4,
        actualHours: 1,
        createdAt: new Date(),
        completedAt: null,
      },
      {
        id: 3,
        userId: 1,
        subjectId: 3,
        title: "Physics Lab Report",
        description: "Complete analysis and conclusion",
        priority: "high" as const,
        status: "pending" as const,
        dueDate: "2025-03-12",
        estimatedHours: 2,
        actualHours: 0,
        createdAt: new Date(),
        completedAt: null,
      },
    ];

    tasks.forEach(task => {
      this.tasks.set(task.id, task);
    });
    this.currentTaskId = 4;

    // Create demo study sessions for today
    const today = new Date();
    const sessions = [
      {
        id: 1,
        userId: 1,
        taskId: 1,
        subjectId: 1,
        title: "Linear Algebra",
        description: "Chapter 5: Eigenvalues",
        startTime: new Date(today.setHours(9, 0, 0, 0)),
        endTime: new Date(today.setHours(10, 30, 0, 0)),
        actualDuration: 90,
        status: "scheduled" as const,
        createdAt: new Date(),
      },
      {
        id: 2,
        userId: 1,
        taskId: 2,
        subjectId: 2,
        title: "Data Structures",
        description: "Binary Trees Practice",
        startTime: new Date(today.setHours(14, 0, 0, 0)),
        endTime: new Date(today.setHours(16, 0, 0, 0)),
        actualDuration: 120,
        status: "scheduled" as const,
        createdAt: new Date(),
      },
      {
        id: 3,
        userId: 1,
        taskId: 3,
        subjectId: 3,
        title: "Physics Lab Report",
        description: "Analysis & Conclusion",
        startTime: new Date(today.setHours(19, 0, 0, 0)),
        endTime: new Date(today.setHours(20, 0, 0, 0)),
        actualDuration: 60,
        status: "scheduled" as const,
        createdAt: new Date(),
      },
    ];

    sessions.forEach(session => {
      this.studySessions.set(session.id, session);
    });
    this.currentSessionId = 4;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      ...insertUser,
      id,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  // Subject methods
  async getSubjects(userId: number): Promise<Subject[]> {
    return Array.from(this.subjects.values()).filter(subject => subject.userId === userId);
  }

  async getSubject(id: number): Promise<Subject | undefined> {
    return this.subjects.get(id);
  }

  async createSubject(insertSubject: InsertSubject): Promise<Subject> {
    const id = this.currentSubjectId++;
    const subject: Subject = {
      ...insertSubject,
      id,
      createdAt: new Date(),
    };
    this.subjects.set(id, subject);
    return subject;
  }

  async updateSubject(id: number, updateData: Partial<Subject>): Promise<Subject | undefined> {
    const subject = this.subjects.get(id);
    if (!subject) return undefined;

    const updated = { ...subject, ...updateData };
    this.subjects.set(id, updated);
    return updated;
  }

  async deleteSubject(id: number): Promise<boolean> {
    return this.subjects.delete(id);
  }

  // Task methods
  async getTasks(userId: number): Promise<TaskWithSubject[]> {
    const userTasks = Array.from(this.tasks.values()).filter(task => task.userId === userId);
    return userTasks.map(task => ({
      ...task,
      subject: task.subjectId ? this.subjects.get(task.subjectId) : undefined,
    }));
  }

  async getTask(id: number): Promise<TaskWithSubject | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;

    return {
      ...task,
      subject: task.subjectId ? this.subjects.get(task.subjectId) : undefined,
    };
  }

  async createTask(insertTask: InsertTask): Promise<TaskWithSubject> {
    const id = this.currentTaskId++;
    const task: Task = {
      ...insertTask,
      id,
      createdAt: new Date(),
      completedAt: null,
    };
    this.tasks.set(id, task);

    return {
      ...task,
      subject: task.subjectId ? this.subjects.get(task.subjectId) : undefined,
    };
  }

  async updateTask(id: number, updateData: Partial<Task>): Promise<TaskWithSubject | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;

    const updated = { ...task, ...updateData };
    if (updateData.status === "completed" && task.status !== "completed") {
      updated.completedAt = new Date();
    }
    
    this.tasks.set(id, updated);
    return {
      ...updated,
      subject: updated.subjectId ? this.subjects.get(updated.subjectId) : undefined,
    };
  }

  async deleteTask(id: number): Promise<boolean> {
    return this.tasks.delete(id);
  }

  async getTasksByStatus(userId: number, status: string): Promise<TaskWithSubject[]> {
    const tasks = await this.getTasks(userId);
    return tasks.filter(task => task.status === status);
  }

  async getUpcomingTasks(userId: number, days: number = 7): Promise<TaskWithSubject[]> {
    const tasks = await this.getTasks(userId);
    const now = new Date();
    const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      return dueDate >= now && dueDate <= futureDate && task.status !== "completed";
    });
  }

  // Study session methods
  async getStudySessions(userId: number): Promise<StudySessionWithDetails[]> {
    const userSessions = Array.from(this.studySessions.values())
      .filter(session => session.userId === userId);

    return userSessions.map(session => ({
      ...session,
      task: session.taskId ? this.tasks.get(session.taskId) : undefined,
      subject: session.subjectId ? this.subjects.get(session.subjectId) : undefined,
    }));
  }

  async getStudySession(id: number): Promise<StudySessionWithDetails | undefined> {
    const session = this.studySessions.get(id);
    if (!session) return undefined;

    return {
      ...session,
      task: session.taskId ? this.tasks.get(session.taskId) : undefined,
      subject: session.subjectId ? this.subjects.get(session.subjectId) : undefined,
    };
  }

  async createStudySession(insertSession: InsertStudySession): Promise<StudySessionWithDetails> {
    const id = this.currentSessionId++;
    const session: StudySession = {
      ...insertSession,
      id,
      createdAt: new Date(),
    };
    this.studySessions.set(id, session);

    return {
      ...session,
      task: session.taskId ? this.tasks.get(session.taskId) : undefined,
      subject: session.subjectId ? this.subjects.get(session.subjectId) : undefined,
    };
  }

  async updateStudySession(id: number, updateData: Partial<StudySession>): Promise<StudySessionWithDetails | undefined> {
    const session = this.studySessions.get(id);
    if (!session) return undefined;

    const updated = { ...session, ...updateData };
    this.studySessions.set(id, updated);

    return {
      ...updated,
      task: updated.taskId ? this.tasks.get(updated.taskId) : undefined,
      subject: updated.subjectId ? this.subjects.get(updated.subjectId) : undefined,
    };
  }

  async deleteStudySession(id: number): Promise<boolean> {
    return this.studySessions.delete(id);
  }

  async getTodaysSessions(userId: number): Promise<StudySessionWithDetails[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const sessions = await this.getStudySessions(userId);
    return sessions.filter(session => {
      const sessionDate = new Date(session.startTime);
      return sessionDate >= today && sessionDate < tomorrow;
    });
  }

  // User stats methods
  async getUserStats(userId: number, date: string): Promise<UserStats | undefined> {
    const key = `${userId}-${date}`;
    return this.userStats.get(key);
  }

  async createOrUpdateUserStats(insertStats: InsertUserStats): Promise<UserStats> {
    const key = `${insertStats.userId}-${insertStats.date}`;
    const existing = this.userStats.get(key);

    if (existing) {
      const updated = { ...existing, ...insertStats };
      this.userStats.set(key, updated);
      return updated;
    } else {
      const id = this.currentStatsId++;
      const stats: UserStats = {
        ...insertStats,
        id,
      };
      this.userStats.set(key, stats);
      return stats;
    }
  }

  async getWeeklyStats(userId: number): Promise<UserStats[]> {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    return Array.from(this.userStats.values())
      .filter(stats => {
        if (stats.userId !== userId) return false;
        const statsDate = new Date(stats.date);
        return statsDate >= weekAgo && statsDate <= today;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }
}

export const storage = new MemStorage();
