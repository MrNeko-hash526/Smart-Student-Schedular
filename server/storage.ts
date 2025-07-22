import { 
  users, 
  subjects, 
  tasks, 
  studySessions, 
  userStats
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, desc } from "drizzle-orm";
import { addDays, format } from "date-fns";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<any | undefined>;
  getUserByUsername(username: string): Promise<any | undefined>;
  createUser(user: any): Promise<any>;

  // Subject methods
  getSubjects(userId: number): Promise<any[]>;
  getSubject(id: number): Promise<any | undefined>;
  createSubject(subject: any): Promise<any>;
  updateSubject(id: number, subject: any): Promise<any | undefined>;
  deleteSubject(id: number): Promise<boolean>;

  // Task methods
  getTasks(userId: number): Promise<any[]>;
  getTask(id: number): Promise<any | undefined>;
  createTask(task: any): Promise<any>;
  updateTask(id: number, task: any): Promise<any | undefined>;
  deleteTask(id: number): Promise<boolean>;
  getTasksByStatus(userId: number, status: string): Promise<any[]>;
  getUpcomingTasks(userId: number, days?: number): Promise<any[]>;

  // Study session methods
  getStudySessions(userId: number): Promise<any[]>;
  getStudySession(id: number): Promise<any | undefined>;
  createStudySession(session: any): Promise<any>;
  updateStudySession(id: number, session: any): Promise<any | undefined>;
  deleteStudySession(id: number): Promise<boolean>;
  getTodaysSessions(userId: number): Promise<any[]>;

  // User stats methods
  getUserStats(userId: number, date: string): Promise<any | undefined>;
  createOrUpdateUserStats(stats: any): Promise<any>;
  getWeeklyStats(userId: number): Promise<any[]>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<any | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<any | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: any): Promise<any> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Subject methods
  async getSubjects(userId: number): Promise<any[]> {
    return await db.select().from(subjects).where(eq(subjects.userId, userId));
  }

  async getSubject(id: number): Promise<any | undefined> {
    const [subject] = await db.select().from(subjects).where(eq(subjects.id, id));
    return subject || undefined;
  }

  async createSubject(insertSubject: any): Promise<any> {
    const [subject] = await db
      .insert(subjects)
      .values(insertSubject)
      .returning();
    return subject;
  }

  async updateSubject(id: number, updateData: any): Promise<any | undefined> {
    const [updated] = await db
      .update(subjects)
      .set(updateData)
      .where(eq(subjects.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteSubject(id: number): Promise<boolean> {
    const result = await db.delete(subjects).where(eq(subjects.id, id));
    return result.rowCount > 0;
  }

  // Task methods
  async getTasks(userId: number): Promise<any[]> {
    return await db
      .select({
        id: tasks.id,
        userId: tasks.userId,
        subjectId: tasks.subjectId,
        title: tasks.title,
        description: tasks.description,
        priority: tasks.priority,
        status: tasks.status,
        dueDate: tasks.dueDate,
        estimatedHours: tasks.estimatedHours,
        actualHours: tasks.actualHours,
        createdAt: tasks.createdAt,
        completedAt: tasks.completedAt,
        subject: {
          id: subjects.id,
          name: subjects.name,
          code: subjects.code,
          color: subjects.color
        }
      })
      .from(tasks)
      .leftJoin(subjects, eq(tasks.subjectId, subjects.id))
      .where(eq(tasks.userId, userId));
  }

  async getTask(id: number): Promise<any | undefined> {
    const [task] = await db
      .select({
        id: tasks.id,
        userId: tasks.userId,
        subjectId: tasks.subjectId,
        title: tasks.title,
        description: tasks.description,
        priority: tasks.priority,
        status: tasks.status,
        dueDate: tasks.dueDate,
        estimatedHours: tasks.estimatedHours,
        actualHours: tasks.actualHours,
        createdAt: tasks.createdAt,
        completedAt: tasks.completedAt,
        subject: {
          id: subjects.id,
          name: subjects.name,
          code: subjects.code,
          color: subjects.color
        }
      })
      .from(tasks)
      .leftJoin(subjects, eq(tasks.subjectId, subjects.id))
      .where(eq(tasks.id, id));
    return task || undefined;
  }

  async createTask(insertTask: any): Promise<any> {
    const [task] = await db
      .insert(tasks)
      .values(insertTask)
      .returning();
    
    return await this.getTask(task.id);
  }

  async updateTask(id: number, updateData: any): Promise<any | undefined> {
    const currentTask = await this.getTask(id);
    if (!currentTask) return undefined;

    if (updateData.status === "completed" && currentTask.status !== "completed") {
      updateData.completedAt = new Date();
    }

    const [updated] = await db
      .update(tasks)
      .set(updateData)
      .where(eq(tasks.id, id))
      .returning();
    
    if (!updated) return undefined;
    return await this.getTask(updated.id);
  }

  async deleteTask(id: number): Promise<boolean> {
    const result = await db.delete(tasks).where(eq(tasks.id, id));
    return result.rowCount > 0;
  }

  async getTasksByStatus(userId: number, status: string): Promise<any[]> {
    const allTasks = await this.getTasks(userId);
    return allTasks.filter(task => task.status === status);
  }

  async getUpcomingTasks(userId: number, days: number = 7): Promise<any[]> {
    const now = new Date();
    const futureDate = addDays(now, days);

    return await db
      .select({
        id: tasks.id,
        userId: tasks.userId,
        subjectId: tasks.subjectId,
        title: tasks.title,
        description: tasks.description,
        priority: tasks.priority,
        status: tasks.status,
        dueDate: tasks.dueDate,
        estimatedHours: tasks.estimatedHours,
        actualHours: tasks.actualHours,
        createdAt: tasks.createdAt,
        completedAt: tasks.completedAt,
        subject: {
          id: subjects.id,
          name: subjects.name,
          code: subjects.code,
          color: subjects.color
        }
      })
      .from(tasks)
      .leftJoin(subjects, eq(tasks.subjectId, subjects.id))
      .where(
        and(
          eq(tasks.userId, userId),
          gte(tasks.dueDate, format(now, 'yyyy-MM-dd')),
          lte(tasks.dueDate, format(futureDate, 'yyyy-MM-dd'))
        )
      );
  }

  // Study session methods
  async getStudySessions(userId: number): Promise<any[]> {
    return await db
      .select({
        id: studySessions.id,
        userId: studySessions.userId,
        taskId: studySessions.taskId,
        subjectId: studySessions.subjectId,
        title: studySessions.title,
        description: studySessions.description,
        startTime: studySessions.startTime,
        endTime: studySessions.endTime,
        actualDuration: studySessions.actualDuration,
        status: studySessions.status,
        createdAt: studySessions.createdAt,
        task: {
          id: tasks.id,
          title: tasks.title
        },
        subject: {
          id: subjects.id,
          name: subjects.name,
          color: subjects.color
        }
      })
      .from(studySessions)
      .leftJoin(tasks, eq(studySessions.taskId, tasks.id))
      .leftJoin(subjects, eq(studySessions.subjectId, subjects.id))
      .where(eq(studySessions.userId, userId));
  }

  async getStudySession(id: number): Promise<any | undefined> {
    const [session] = await db
      .select({
        id: studySessions.id,
        userId: studySessions.userId,
        taskId: studySessions.taskId,
        subjectId: studySessions.subjectId,
        title: studySessions.title,
        description: studySessions.description,
        startTime: studySessions.startTime,
        endTime: studySessions.endTime,
        actualDuration: studySessions.actualDuration,
        status: studySessions.status,
        createdAt: studySessions.createdAt,
        task: {
          id: tasks.id,
          title: tasks.title
        },
        subject: {
          id: subjects.id,
          name: subjects.name,
          color: subjects.color
        }
      })
      .from(studySessions)
      .leftJoin(tasks, eq(studySessions.taskId, tasks.id))
      .leftJoin(subjects, eq(studySessions.subjectId, subjects.id))
      .where(eq(studySessions.id, id));
    return session || undefined;
  }

  async createStudySession(insertSession: any): Promise<any> {
    const [session] = await db
      .insert(studySessions)
      .values(insertSession)
      .returning();
    
    return await this.getStudySession(session.id);
  }

  async updateStudySession(id: number, updateData: any): Promise<any | undefined> {
    const [updated] = await db
      .update(studySessions)
      .set(updateData)
      .where(eq(studySessions.id, id))
      .returning();
    
    if (!updated) return undefined;
    return await this.getStudySession(updated.id);
  }

  async deleteStudySession(id: number): Promise<boolean> {
    const result = await db.delete(studySessions).where(eq(studySessions.id, id));
    return result.rowCount > 0;
  }

  async getTodaysSessions(userId: number): Promise<any[]> {
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');

    return await db
      .select({
        id: studySessions.id,
        userId: studySessions.userId,
        taskId: studySessions.taskId,
        subjectId: studySessions.subjectId,
        title: studySessions.title,
        description: studySessions.description,
        startTime: studySessions.startTime,
        endTime: studySessions.endTime,
        actualDuration: studySessions.actualDuration,
        status: studySessions.status,
        createdAt: studySessions.createdAt,
        task: {
          id: tasks.id,
          title: tasks.title
        },
        subject: {
          id: subjects.id,
          name: subjects.name,
          color: subjects.color
        }
      })
      .from(studySessions)
      .leftJoin(tasks, eq(studySessions.taskId, tasks.id))
      .leftJoin(subjects, eq(studySessions.subjectId, subjects.id))
      .where(
        and(
          eq(studySessions.userId, userId),
          gte(studySessions.startTime, todayStr),
          lte(studySessions.startTime, todayStr + ' 23:59:59')
        )
      );
  }

  // User stats methods
  async getUserStats(userId: number, date: string): Promise<any | undefined> {
    const [stats] = await db
      .select()
      .from(userStats)
      .where(and(eq(userStats.userId, userId), eq(userStats.date, date)));
    return stats || undefined;
  }

  async createOrUpdateUserStats(insertStats: any): Promise<any> {
    const existing = await this.getUserStats(insertStats.userId, insertStats.date);

    if (existing) {
      const [updated] = await db
        .update(userStats)
        .set(insertStats)
        .where(and(eq(userStats.userId, insertStats.userId), eq(userStats.date, insertStats.date)))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(userStats)
        .values(insertStats)
        .returning();
      return created;
    }
  }

  async getWeeklyStats(userId: number): Promise<any[]> {
    const today = new Date();
    const weekAgo = addDays(today, -7);

    return await db
      .select()
      .from(userStats)
      .where(
        and(
          eq(userStats.userId, userId),
          gte(userStats.date, format(weekAgo, 'yyyy-MM-dd')),
          lte(userStats.date, format(today, 'yyyy-MM-dd'))
        )
      )
      .orderBy(desc(userStats.date));
  }
}

export const storage = new DatabaseStorage();